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
    @InjectMetric('hm_response_ellapsed_time')
    private metricEllTime: Histogram<string>,
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
      // ToDo need research rpc context info
      // const ctx = context.switchToRpc();
    }

    this.metricReqCount.inc(labels);
    const ellTimeTimer = this.metricEllTime.startTimer(labels);

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
