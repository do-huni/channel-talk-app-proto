import { Injectable } from '@nestjs/common';
import { HandlerService } from 'src/common/service/handler.service';

@Injectable()
export class HandlerRegistry {
  private handlers: Map<string, HandlerService> = new Map();

  registerHandler(method: string, service: HandlerService) {
    this.handlers.set(method, service);
  }

  async executeHandler(method: string, ...args: any[]): Promise<any> {
    const handlerService = this.handlers.get(method);
    if (!handlerService) {
      throw new Error(`Handler for method ${method} not found`);
    }

    // execute 메서드를 호출하고 결과 반환
    return await handlerService.execute(...args);
  }
}
