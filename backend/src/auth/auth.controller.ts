import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { verifyRequestSchema, VerifyRequestDto } from './dto/auth.dto';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('verify')
  @HttpCode(200)
  async verify(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = verifyRequestSchema.safeParse(body);

    this.logger.log('Verify request body:', body);

    if (!result.success) {
      return {
        success: false,
        error: 'Invalid request body',
      };
    }

    const dto: VerifyRequestDto = result.data;
    const { token, response } = await this.authService.verifyAndLogin(dto);

    // Set httpOnly cookie
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('kobe_auth', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      data: response,
    };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('kobe_auth');
    return { success: true };
  }
}
