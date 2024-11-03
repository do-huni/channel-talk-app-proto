import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { HandlerRegistry } from 'src/common/handler/handler.registry';

@Controller('function')
export class AppController {
  constructor(private readonly handlerRegistry: HandlerRegistry) {}

  @Post()
  async handleFunction(@Body() body: any): Promise<any> {
    const { method, context, params } = body;

    if (!method) {
      throw new BadRequestException('Missing "method" in request body');
    }

    try {
      return await this.handlerRegistry.executeHandler(method, context, params);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
