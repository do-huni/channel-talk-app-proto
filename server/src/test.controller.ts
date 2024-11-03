import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { generateSignature } from 'src/common/util/util';

@Controller()
export class TestController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
