import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChannelApiService } from 'src/channel-api/channelApi.service';
import { Command } from 'src/common/interfaces/command';
import { FunctionRequest } from 'src/common/interfaces/function.interface';
import { HandlerService } from 'src/common/service/handler.service';
import { TutorialInput } from 'src/tutorial/tutorial.input';

export const TUTORIAL = 'tutorial';

@Injectable()
export class TutorialService
  implements HandlerService<TutorialInput>, OnModuleInit
{
  constructor(private readonly apiService: ChannelApiService) {}

  async onModuleInit() {
    await this.registerCommand();
  }

  /**
   * 실제 로직 처리
   */
  execute(body: FunctionRequest<TutorialInput>) {
    return {
      message: `Processing ${TUTORIAL} command`,
      data: body,
    };
  }

  /**
   * 외부 채널에 `tutorial` 커맨드를 등록하는 메서드
   */
  private async registerCommand() {
    const command: Command = {
      name: TUTORIAL,
      scope: 'desk',
      description: 'This is a desk command of App-tutorial',
      actionFunctionName: TUTORIAL,
      alfMode: 'disable',
      enabledByDefault: true,
    };
    await this.apiService.onModuleInit();
    await this.apiService.registerCommandToChannel(command);
  }
}
