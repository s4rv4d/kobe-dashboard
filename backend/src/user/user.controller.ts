import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { updateUserProfileSchema } from './dto/user.dto';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':address')
  @UseGuards(JwtAuthGuard)
  async getUserDetails(
    @Param('address') address: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userDetails = await this.userService.getUserDetails(
      address,
      req.user.address,
    );

    return {
      success: true,
      data: userDetails,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    const parsed = updateUserProfileSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues[0].message);
    }

    const userDetails = await this.userService.updateUserProfile(
      req.user.address,
      parsed.data,
    );

    return {
      success: true,
      data: userDetails,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  @Post('me/photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images allowed');
    }

    const userDetails = await this.userService.uploadProfilePhoto(
      req.user.address,
      file.buffer,
      file.mimetype,
    );

    return {
      success: true,
      data: userDetails,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  @Delete('me/photo')
  @UseGuards(JwtAuthGuard)
  async deletePhoto(@Req() req: AuthenticatedRequest) {
    const userDetails = await this.userService.deleteProfilePhoto(
      req.user.address,
    );

    return {
      success: true,
      data: userDetails,
      meta: { timestamp: new Date().toISOString() },
    };
  }
}
