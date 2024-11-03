import { Module, OnModuleInit } from '@nestjs/common';

import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SignatureInterceptor } from 'src/common/interceptor/signature.interceptor';
import { HandlerRegistry } from 'src/common/handler/handler.registry';
import { TutorialService } from 'src/tutorial/tutorial.service';
import { AppController } from 'src/app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    HandlerRegistry,
    TutorialService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => {
        const secretKey = process.env.SECRET_KEY;
        return new SignatureInterceptor(secretKey);
      },
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly handlerRegistry: HandlerRegistry,
    private readonly tutorialService: TutorialService,
  ) {}
  onModuleInit() {
    this.handlerRegistry.registerHandler('tutorial', this.tutorialService);
  }
}
