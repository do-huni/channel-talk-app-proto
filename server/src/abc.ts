import axios, { AxiosInstance } from 'axios';

interface Command {
  name: string;
  scope: string;
  description: string;
  actionFunctionName: string;
  alfMode: 'enable' | 'disable';
  enabledByDefault: boolean;
}

interface RegisterCommandsParam {
  appId: string;
  commands: Command[];
}

interface WriteGroupMessageParams {
  // 추가적인 메시지 파라미터를 여기에 정의하세요.
}

interface NativeFunctionRequest<T> {
  method: string;
  params: T;
}

interface NativeFunctionResponse<T> {
  result: T;
  error: {
    type: string;
    message: string;
  };
}

class AppStoreClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  async registerCommands(token: string): Promise<any> {
    const commands: Command[] = [
      {
        name: 'tutorial',
        scope: 'desk',
        description: 'This is a desk command of App-tutorial',
        actionFunctionName: 'tutorial',
        alfMode: 'disable',
        enabledByDefault: true,
      },
      // 필요하다면 다른 명령어 추가
    ];

    const requestBody: NativeFunctionRequest<RegisterCommandsParam> = {
      method: 'registerCommands',
      params: {
        appId: process.env.CHANNEL_APPLICATION_ID,
        commands,
      },
    };

    try {
      const response = await this.client.put<NativeFunctionResponse<any>>(
        '/general/v1/native/functions',
        requestBody,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      if (response.data.error.type || response.data.error.message) {
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      throw new Error(`Failed to request registerCommands: ${error.message}`);
    }
  }

  async writeGroupMessage(
    token: string,
    params: WriteGroupMessageParams,
  ): Promise<any> {
    const requestBody: NativeFunctionRequest<WriteGroupMessageParams> = {
      method: 'writeGroupMessage',
      params,
    };

    try {
      const response = await this.client.put<NativeFunctionResponse<any>>(
        '/general/v1/native/functions',
        requestBody,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      if (response.data.error.type || response.data.error.message) {
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      throw new Error(`Failed to request writeGroupMessage: ${error.message}`);
    }
  }
}

export default AppStoreClient;
