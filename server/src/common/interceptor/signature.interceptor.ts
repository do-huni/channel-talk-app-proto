import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { generateSignature } from 'src/common/util/util';

@Injectable()
export class SignatureInterceptor implements NestInterceptor {
  constructor(private readonly secretKey: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    return next.handle().pipe(
      tap(() => {
        const requestBody = JSON.stringify(request.body);
        const signature = generateSignature(this.secretKey, requestBody);
        response.setHeader('X-Signature', signature);
      }),
    );
  }
}
