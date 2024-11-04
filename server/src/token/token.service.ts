import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TokenService {
  private readonly authUrl =
    'https://app-store-api.channel.io/general/v1/native/functions'; // Channel.io의 토큰 엔드포인트
  private readonly clientSecret = process.env.CHANNEL_SECRET_KEY;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * access-token과 refresh-token을 처음 발급받아 저장합니다.
   */
  async initializeTokens() {
    let tokens: { accessToken: string; refreshToken: string } = {
      accessToken: null,
      refreshToken: null,
    };
    tokens.accessToken = await this.getAccessToken();
    tokens.refreshToken = await this.getRefreshToken();
    if (!tokens.accessToken) {
      if (!tokens.refreshToken) {
        tokens = await this.fetchNewTokens();
      } else {
        tokens = await this.refreshAccessToken();
      }
    }
    await this.cacheManager.set('accessToken', tokens.accessToken);
    await this.cacheManager.set('refreshToken', tokens.refreshToken);
  }

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
  private async fetchNewTokens() {
    try {
      const response = await axios.put(this.authUrl, {
        method: 'issueToken',
        params: {
          secret: this.clientSecret,
        },
      });
      if (response.data.error) {
        throw new InternalServerErrorException(response.data.error);
      }
      return {
        accessToken: response.data.result.accessToken,
        refreshToken: response.data.result.refreshToken,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * access-token을 갱신합니다.
   */
  async refreshAccessToken() {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      throw new HttpException(
        'No refresh token available',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const response = await axios.put(this.authUrl, {
        method: 'refreshToken',
        params: {
          refreshToken: refreshToken,
        },
      });
      if (response.data.error) {
        throw new InternalServerErrorException(response.data.error);
      }

      // 새로운 토큰을 캐시에 저장
      const newAccessToken = response.data.result.accessToken;
      const newRefreshToken = response.data.result.refreshToken;
      await this.cacheManager.set('accessToken', newAccessToken);
      await this.cacheManager.set('refreshToken', newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }
}
