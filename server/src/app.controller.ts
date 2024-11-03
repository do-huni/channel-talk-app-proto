import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HandlerRegistry } from 'src/common/handler/handler.registry';

@Controller('function')
export class AppController {
  constructor(private readonly handlerRegistry: HandlerRegistry) {}

  @ApiOperation({
    summary: '채널톡 API 엔드포인트',
    description: '채널톡 API를 받는 엔드포인트입니다.',
  })
  @ApiOkResponse({})
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
