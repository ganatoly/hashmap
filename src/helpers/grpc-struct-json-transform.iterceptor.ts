import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { transformFromStruct, transformToStruct } from './proto-struct-mapper';

@Injectable()
export class GRPCStructJSONTransformInterceptor implements NestInterceptor {
  constructor(private reqField?: string, private resField?: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();

      if (this.reqField && request?.body && request?.body[this.reqField])
        request.body[this.reqField] = transformFromStruct(
          request.body[this.reqField],
        );
    } else if (context.getType() === 'rpc') {
      const ctx = context.switchToRpc();
      const request = ctx.getData();

      if (this.reqField && request && request[this.reqField])
        request[this.reqField] = transformFromStruct(request[this.reqField]);
    }

    return next.handle().pipe(
      map((data) => {
        if (this.resField && data && data[this.resField])
          data[this.resField] = transformToStruct(data[this.resField]);
        return data;
      }),
    );
  }
}
