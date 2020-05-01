import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import {
  RefreshTokenDto,
  refreshTokenKey,
  refreshTokenPartialKey,
} from '../dto/refresh-token.dto';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthenticationService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const refreshTokenFirstPart: string = req.cookies[refreshTokenPartialKey];
    const refreshTokenDto: RefreshTokenDto = req.cookies[refreshTokenKey];

    if (refreshTokenFirstPart == undefined || refreshTokenDto === undefined) {
      return Promise.resolve(false);
    }

    return this.authService.validateRefreshToken(
      refreshTokenDto.userId,
      `${refreshTokenFirstPart}${refreshTokenDto.refreshToken}`,
    );
  }
}
