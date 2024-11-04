import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HandlerRegistry } from 'src/common/handler/handler.registry';
import { BaseInput } from 'src/common/interfaces/base.input';
import { FunctionRequest } from 'src/common/interfaces/function.interface';

@Controller('function')
export class AppController {
  constructor(private readonly handlerRegistry: HandlerRegistry) {}

  @ApiOperation({
    summary: '채널톡 API 엔드포인트',
    description: '채널톡 API를 받는 엔드포인트입니다.',
  })
  @ApiOkResponse({})
  @Post()
  async handleFunction(@Body() body: FunctionRequest<BaseInput>): Promise<any> {
    try {
      return await this.handlerRegistry.executeHandler(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
