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
    let reqData = undefined;
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      if (request.method === 'POST') reqData = request.body;
      else if (request.method === 'GET') reqData = request.query;
      logTag = `HTTP[${request.method}: ${request.url}]`;
    } else if (context.getType() === 'rpc') {
      logTag = `RPC`;
      const ctx = context.switchToRpc();
      reqData = ctx.getData();
    }

    this.logger.debug(`${logTag}| invoke, request: ${JSON.stringify(reqData)}`);
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
