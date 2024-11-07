import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Command } from 'src/common/interfaces/command';
import { BaseFunctionRequest } from 'src/common/interfaces/function.interface';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class ChannelApiService {
  private readonly logger = new Logger(ChannelApiService.name);
  private axiosInstance: AxiosInstance;
  private initialized = false;
  private initializationPromise: Promise<void>;
  private readonly baseUrl = process.env.BASE_URL;
  private readonly appId = process.env.CHANNEL_APPLICATION_ID;

  constructor(private readonly tokenService: TokenService) {
    if (!this.baseUrl || !this.appId) {
      this.logger.error('Missing required configuration values');
      throw new Error('Missing required configuration values');
    }
  }

  async onModuleInit() {
    this.initializationPromise = this.initialize();
    await this.initializationPromise;
  }

  private async initialize() {
    try {
      this.logger.log('Initializing ChannelApiService...');
      await this.tokenService.initializeTokens();

      this.axiosInstance = axios.create({
        baseURL: this.baseUrl,
      });

      this.axiosInstance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
          let accessToken = await this.tokenService.getAccessToken();
          if (!accessToken) {
            this.logger.debug('Access token not found, initializing tokens...');
            await this.tokenService.initializeTokens();
            accessToken = await this.tokenService.getAccessToken();
          }
          this.logger.debug('Adding access token to request headers');
          config.headers['x-access-token'] = accessToken;
          return config;
        },
        (error) => {
          this.logger.error('Request interceptor error', error.stack);
          return Promise.reject(error);
        },
      );

      this.initialized = true;
      this.logger.log('ChannelApiService initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize ChannelApiService', error.stack);
      throw error;
    }
  }

  async waitForInitialization(): Promise<void> {
    if (this.initialized) return;

    if (!this.initializationPromise) {
      this.logger.error('Service not properly initialized');
      throw new Error('Service not properly initialized');
    }

    try {
      await this.initializationPromise;
      if (!this.initialized) {
        throw new Error('Initialization failed');
      }
    } catch (error) {
      this.logger.error('Failed waiting for initialization', error.stack);
      throw error;
    }
  }

  async useNativeFunction<T>(method: string, requestParams: T) {
    try {
      const request: BaseFunctionRequest<T> = {
        method: method,
        params: requestParams,
      };
      const response = await this.axiosInstance.put(
        'https://app-store-api.channel.io/general/v1/native/functions',
        request,
      );
      console.log(response);
      return response;
    } catch (error) {
      this.logger.error('Failed to use native function');
      this.logger.error(error.message);
      this.logger.error(error.stack);
      throw error;
    }
  }
  /**
   * 외부 API에 커맨드를 등록하는 함수
   */
  async registerCommandToChannel(command: Command) {
    try {
      this.logger.log(`Registering command: ${command.name}`);
      await this.axiosInstance.put(
        'https://app-store-api.channel.io/general/v1/native/functions',
        {
          method: 'registerCommands',
          params: {
            AppID: this.appId,
            Commands: [command],
          },
        },
      );
      this.logger.log(`Command registered successfully: ${command.name}`);
    } catch (error) {
      this.logger.error(
        `Failed to register command: ${command.name}`,
        error.stack,
      );
      throw new Error(error);
    }
  }
}
