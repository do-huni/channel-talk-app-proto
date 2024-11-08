import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Inject,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

@Injectable()
export class TokenService {
  private readonly authUrl =
    'https://app-store-api.channel.io/general/v1/native/functions'; // Channel.io의 토큰 엔드포인트
  private readonly clientSecret = process.env.CHANNEL_SECRET_KEY;
  private readonly logger = new Logger(TokenService.name);
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * access-token을 가져옵니다.
   */
  async getAccessToken(): Promise<string | null> {
    const accessToken = await this.cacheManager.get<string>('accessToken');
    return accessToken;
  }

  /**
   * refresh-token을 가져옵니다.
   */
  async getRefreshToken(): Promise<string | null> {
    return await this.cacheManager.get<string>('refreshToken');
  }

  /**
   * Channel.io API를 통해 새로운 access-token과 refresh-token을 발급받습니다.
   */
  async getChannelToken(channelId: string = 'general'): Promise<TokenResponse> {
    try {
      const cachedToken: string | undefined =
        await this.cacheManager.get(channelId);
      const channelToken: TokenResponse | undefined =
        typeof cachedToken === 'string' ? JSON.parse(cachedToken) : undefined;
      if (
        channelToken === undefined ||
        channelToken.expiresAt < new Date().getTime() / 1000
      ) {
        const tokensResponse: TokenResponse =
          await this.requestIssueToken(channelId);
        await this.cacheManager.set(channelId, JSON.stringify(tokensResponse));
        return tokensResponse;
      }

      return channelToken;
    } catch (error) {
      this.logger.error('Error fetching new tokens', error.stack);
      console.log(error);
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }

  private async requestIssueToken(channelId: string) {
    const response = await axios.put(this.authUrl, {
      method: 'issueToken',
      params: {
        secret: this.clientSecret,
        channelId: channelId === 'general' ? undefined : channelId,
      },
    });
    if (response.data.error) {
      throw new InternalServerErrorException(response.data.error);
    }
    const accessToken = response.data.result.accessToken;
    const refreshToken = response.data.result.refreshToken;
    const expiresAt =
      new Date().getTime() / 1000 + response.data.result.expiresIn - 5;
    return { accessToken, refreshToken, expiresAt };
  }
}
