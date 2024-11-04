import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Command } from 'src/common/interfaces/command';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class ChannelApiService {
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl = process.env.BASE_URL;
  private readonly appId = process.env.CHANNEL_APPLICATION_ID;

  constructor(private readonly tokenService: TokenService) {
    if (!this.baseUrl || !this.appId) {
      throw new Error('Missing required configuration values');
    }

    // axios 인스턴스 생성
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
    });

    // 요청 인터셉터: x-access-token 추가
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        let accessToken = await this.tokenService.getAccessToken();
        if (!accessToken) {
          await this.tokenService.initializeTokens();
          accessToken = await this.tokenService.getAccessToken();
        }
        config.headers['x-access-token'] = accessToken;
        return config;
      },
      (error) => Promise.reject(error),
    );

    // 응답 인터셉터: 401 에러 시 토큰 갱신
    // this.axiosInstance.interceptors.response.use(
    //   (response) => response,
    //   async (error) => {
    //     if (error.response && error.response.status === 401) {
    //       try {
    //         await this.tokenService.refreshAccessToken();
    //         const newAccessToken = await this.tokenService.getAccessToken();
    //         error.config.headers['x-access-token'] = newAccessToken;
    //         return this.axiosInstance.request(error.config);
    //       } catch (refreshError) {
    //         throw new HttpException(
    //           'Token refresh failed',
    //           HttpStatus.UNAUTHORIZED,
    //         );
    //       }
    //     }
    //     return Promise.reject(error);
    //   },
    // );
  }

  async onModuleInit() {
    await this.tokenService.initializeTokens();
    const accessToken = await this.tokenService.getAccessToken();
    const refreshToken = await this.tokenService.getRefreshToken();
    console.log(accessToken, refreshToken);
  }

  /**
   * 외부 API에 커맨드를 등록하는 함수
   */
  async registerCommandToChannel(command: Command) {
    try {
      const response = await this.axiosInstance.put(
        'https://app-store-api.channel.io/general/v1/native/functions',
        {
          method: 'registerCommands',
          params: {
            AppID: this.appId,
            Commands: [
              {
                name: 'commandName',
                scope: 'desk',
                description: 'this is test command',
                nameDescI18nMap: {
                  en: {
                    description: 'test command en',
                    name: 'test',
                  },
                  ko: {
                    description: '테스트 커맨드',
                    name: '테스트',
                  },
                },
                actionFunctionName: 'testFunction',
                autoCompleteFunctionName: 'autoCompleteFunctionName',
                paramDefinitions: [
                  {
                    autoComplete: true,
                    name: 'parameterName',
                    nameDescI18nMap: {
                      en: {
                        name: 'parameterEn',
                      },
                      ko: {
                        name: '한국어 파라미터',
                      },
                    },
                    required: false,
                    type: 'string',
                  },
                ],
                enabledByDefault: true,
                alfMode: 'disable',
              },
            ],
          },
        },
      );
      console.log(`Command registered: ${response.status}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}
