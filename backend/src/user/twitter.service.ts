import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../providers/cache/cache.service';
import { UserService } from './user.service';
import { TwitterAuthState } from './user.types';
import * as crypto from 'crypto';

const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TWITTER_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';
const TWITTER_USER_URL = 'https://api.twitter.com/2/users/me';
const STATE_TTL = 600; // 10 minutes

@Injectable()
export class TwitterService {
  private clientId: string;
  private clientSecret: string;
  private callbackUrl: string;

  constructor(
    private configService: ConfigService,
    private cacheService: CacheService,
    private userService: UserService,
  ) {
    this.clientId = this.configService.get<string>('TWITTER_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('TWITTER_CLIENT_SECRET') || '';
    this.callbackUrl = this.configService.get<string>('TWITTER_CALLBACK_URL') || '';
  }

  private generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  private generateCodeChallenge(verifier: string): string {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
  }

  private generateState(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  async getAuthUrl(address: string, frontendRedirectUri: string): Promise<string> {
    if (!this.clientId) {
      throw new BadRequestException('Twitter OAuth not configured');
    }

    const state = this.generateState();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    // Store state in Redis
    const authState: TwitterAuthState = {
      address,
      codeVerifier,
      redirectUri: frontendRedirectUri,
    };
    await this.cacheService.set(`twitter_auth:${state}`, authState, STATE_TTL);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      scope: 'tweet.read users.read',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${TWITTER_AUTH_URL}?${params.toString()}`;
  }

  async handleCallback(code: string, state: string): Promise<{ address: string; redirectUri: string }> {
    // Retrieve state from Redis
    const authState = await this.cacheService.get<TwitterAuthState>(`twitter_auth:${state}`);
    if (!authState) {
      throw new BadRequestException('Invalid or expired state');
    }

    await this.cacheService.delete(`twitter_auth:${state}`);

    // Exchange code for token
    const tokenResponse = await fetch(TWITTER_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.callbackUrl,
        code_verifier: authState.codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new BadRequestException(`Twitter token exchange failed: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user info
    const userResponse = await fetch(TWITTER_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new BadRequestException('Failed to fetch Twitter user info');
    }

    const userData = await userResponse.json();
    const twitterUsername = userData.data?.username;

    if (!twitterUsername) {
      throw new BadRequestException('Could not retrieve Twitter username');
    }

    // Update user details
    await this.userService.updateTwitterUsername(authState.address, twitterUsername);

    return {
      address: authState.address,
      redirectUri: authState.redirectUri,
    };
  }

  async disconnect(address: string): Promise<void> {
    await this.userService.disconnectTwitter(address);
  }
}
