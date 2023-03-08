import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class PromMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('hm_request_count') private metricReqCount: Counter<string>,
    @InjectMetric('hm_response_elapsed_time')
    private metricElTime: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const transport = context.getType();
    const labels = { transport, endpoint: null, method: null };

    if (transport === 'http') {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      labels.endpoint = request.url;
      labels.method = request.method;
    } else if (transport === 'rpc') {
      labels.method = 'rpc';
    }

    this.metricReqCount.inc(labels);
    const ellTimeTimer = this.metricElTime.startTimer(labels);

    return next
      .handle()
      .pipe(tap(() => ellTimeTimer()))
      .pipe(
        catchError((err) => {
          ellTimeTimer();
          return throwError(() => err);
        }),
      );
  }
}
