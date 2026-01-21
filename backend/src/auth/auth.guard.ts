import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthUser } from './auth.types';

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token');
    }

    const payload = this.authService.validateToken(token);
    (request as AuthenticatedRequest).user = { address: payload.sub };

    return true;
  }

  private extractToken(request: Request): string | null {
    // Try cookie first
    const cookieToken = request.cookies?.['kobe_auth'];
    if (cookieToken) {
      return cookieToken;
    }

    // Fallback to Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    return null;
  }
}
