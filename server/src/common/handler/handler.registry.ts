import { Injectable } from '@nestjs/common';
import { FunctionRequest } from 'src/common/interfaces/function.interface';
import { HandlerService } from 'src/common/service/handler.service';

@Injectable()
export class HandlerRegistry {
  private handlers: Map<string, HandlerService<any>> = new Map();

  registerHandler<T>(method: string, service: HandlerService<T>) {
    this.handlers.set(method, service);
  }

  async executeHandler<T>(body: FunctionRequest<T>): Promise<any> {
    const handlerService = this.handlers.get(body.method);
    if (!handlerService) {
      throw new Error(`Handler for method ${body.method} not found`);
    }

    // handlerService가 제네릭 타입을 받도록 수정
    return await handlerService.execute(body);
  }
}
