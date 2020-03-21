import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RefreshTokenDto, refreshTokenKey } from '../dto/refresh-token.dto';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const refreshTokenDto: RefreshTokenDto = req.cookies[refreshTokenKey];

    if (refreshTokenDto === undefined) {
      return Promise.resolve(false);
    }

    return this.authService.validateRefreshToken(
      refreshTokenDto.user_id,
      refreshTokenDto.refresh_token,
    );
  }
}
