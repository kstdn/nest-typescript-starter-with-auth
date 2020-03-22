import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { RefreshTokenDto, refreshTokenKey } from '../dto/refresh-token.dto';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthenticationService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const refreshTokenDto: RefreshTokenDto = req.cookies[refreshTokenKey];

    if (refreshTokenDto === undefined) {
      return Promise.resolve(false);
    }

    return this.authService.validateRefreshToken(
      refreshTokenDto.userId,
      refreshTokenDto.refreshToken,
    );
  }
}
