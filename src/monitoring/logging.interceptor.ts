import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let logTag = 'unknown';
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      logTag = `HTTP[${request.method}: ${request.url}]`;
    } else if (context.getType() === 'rpc') {
      logTag = `RPC`;
      // ToDo need research rpc context info
      // const ctx = context.switchToRpc();
    }

    this.logger.debug(`${logTag}| invoke`);
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap((val) =>
          this.logger.debug(
            `${logTag}| handle success [${
              Date.now() - now
            }ms]| Response: ${JSON.stringify(val)}`,
          ),
        ),
      )
      .pipe(
        catchError((err) => {
          this.logger.error(
            `${logTag}| handle failed [${Date.now() - now}ms]| Error: ${
              err.message
            }`,
            err?.stack,
          );
          return throwError(() => err);
        }),
      );
  }
}
