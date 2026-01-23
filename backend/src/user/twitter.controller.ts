import {
  Controller,
  Get,
  Delete,
  Query,
  Req,
  Res,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { TwitterService } from './twitter.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { twitterCallbackSchema } from './dto/user.dto';

@Controller('user/twitter')
export class TwitterController {
  constructor(private twitterService: TwitterService) {}

  @Get('auth')
  @UseGuards(JwtAuthGuard)
  async initiateAuth(
    @Query('redirect_uri') redirectUri: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!redirectUri) {
      throw new BadRequestException('redirect_uri is required');
    }

    const authUrl = await this.twitterService.getAuthUrl(
      req.user.address,
      redirectUri,
    );

    return {
      success: true,
      data: { authUrl },
      meta: { timestamp: new Date().toISOString() },
    };
  }

  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    const parsed = twitterCallbackSchema.safeParse({ code, state });
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues[0].message);
    }

    const result = await this.twitterService.handleCallback(code, state);

    // Redirect back to frontend
    res.redirect(result.redirectUri);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async disconnect(@Req() req: AuthenticatedRequest) {
    await this.twitterService.disconnect(req.user.address);

    return {
      success: true,
      data: null,
      meta: { timestamp: new Date().toISOString() },
    };
  }
}
