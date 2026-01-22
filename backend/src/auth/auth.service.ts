import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyMessage } from 'ethers';
import { SupabaseService } from '../providers/supabase/supabase.service';
import { JwtPayload } from './auth.types';
import { VerifyRequestDto, VerifyResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  async verifyAndLogin(dto: VerifyRequestDto): Promise<{
    token: string;
    response: VerifyResponseDto;
  }> {
    const { address, signature, message } = dto;

    // Verify signature
    const recoveredAddress = this.verifySignature(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Check message timestamp (5 min window)
    this.validateMessageTimestamp(message);

    // Check if address is allowlisted
    const isAllowed = await this.supabaseService.isAllowlisted(address);
    if (!isAllowed) {
      throw new ForbiddenException('Address not authorized');
    }

    // Generate JWT
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: address.toLowerCase(),
    };

    const token = this.jwtService.sign(payload);
    const decoded: JwtPayload = this.jwtService.decode(token);

    return {
      token,
      response: {
        address: address.toLowerCase(),
        expiresAt: decoded.exp,
      },
    };
  }

  private verifySignature(message: string, signature: string): string {
    try {
      return verifyMessage(message, signature);
    } catch {
      throw new UnauthorizedException('Invalid signature format');
    }
  }

  private validateMessageTimestamp(message: string): void {
    const timestampMatch = message.match(/Timestamp:\s*(\d+)/);
    if (!timestampMatch) {
      throw new UnauthorizedException('Invalid message format');
    }

    const timestamp = parseInt(timestampMatch[1], 10);
    const now = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60;

    if (Math.abs(now - timestamp) > fiveMinutes) {
      throw new UnauthorizedException('Message expired');
    }
  }

  validateToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
