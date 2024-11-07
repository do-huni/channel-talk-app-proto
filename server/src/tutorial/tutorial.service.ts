import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ChannelApiService } from 'src/channel-api/channelApi.service';
import { Command } from 'src/common/interfaces/command';
import { BaseFunctionRequest } from 'src/common/interfaces/function.interface';
import { HandlerService } from 'src/common/service/handler.service';
import { TutorialOutput } from 'src/tutorial/tutorial.dto';
import { TutorialInput } from 'src/tutorial/tutorial.dto';

export const TUTORIAL = 'tutorial';

@Injectable()
export class TutorialService
  implements HandlerService<TutorialInput, TutorialOutput>, OnModuleInit
{
  private readonly logger = new Logger(TutorialService.name);

  constructor(private readonly apiService: ChannelApiService) {}

  async onModuleInit() {
    try {
      await this.apiService.waitForInitialization();
      await this.registerCommand();
    } catch (error) {
      this.logger.error('Failed to initialize TutorialService', error.stack);
      throw error;
    }
  }

  /**
   * 실제 로직 처리
   */
  async execute(
    body: BaseFunctionRequest<TutorialInput>,
  ): Promise<TutorialOutput> {
    console.log(body);

    await this.apiService.useNativeFunction('getChannel', {
      method: 'getChannel',
      params: {
        channelId: body.context.channel.id,
      },
    });
    const requestParams = {
      method: 'writeGroupMessage',
      params: {
        channelId: body.context.channel.id,
        groupId: body.params.chat.id,
        dto: {
          blocks: [], // 메시지 블록이 필요한 경우 추가
          plainText: '안녕하세요! 튜토리얼 메시지입니다.',
          buttons: [
            {
              title: '튜토리얼 버튼',
              colorVariant: 'primary',
              action: {
                commandAction: {
                  attributes: {
                    appId: process.env.APP_ID,
                    name: 'tutorial',
                    params: {},
                  },
                },
              },
            },
          ],
          botName: 'Tutorial Bot',
        },
      },
    };

    await this.apiService.useNativeFunction(
      'writeGroupMessage',
      requestParams.params,
    );
    return {
      result: {
        hello: body,
      },
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
    await this.apiService.registerCommandToChannel(command);
  }
}
