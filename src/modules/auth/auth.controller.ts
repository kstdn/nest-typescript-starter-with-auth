import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { EnvVariables } from '../../env.variables';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { EnvDefaults } from '../../env.defaults';
import { Routes } from '../../routes';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './dto/authenticated-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { RefreshTokenDto, refreshTokenKey } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller(Routes.Auth.Root)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<void> {
    await this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(Routes.Users.ChangePassword)
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.usersService.changePassword(req.user.id, changePasswordDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post(Routes.Auth.Login)
  async login(
    @Body() credentials: LoginRequestDto,
    @Request() req: AuthenticatedRequest,
    @Res() res: ExpressResponse,
  ) {
    // If we reach this method, this means we passed the username/password auth check

    const { accessToken, refreshToken } = await this.generateTokens(
      req.user.id,
    );

    this.setRefreshTokenCookie(res, refreshToken);

    return res.send(accessToken);
  }

  @UseGuards(RefreshTokenGuard)
  @Post(Routes.Auth.RefreshToken)
  async refreshToken(
    @Request() req: ExpressRequest,
    @Res() res: ExpressResponse,
  ) {
    // If we reach this method, this means we passed the refresh token validity check

    const refreshTokenDto: RefreshTokenDto = req.cookies[refreshTokenKey];

    const { accessToken, refreshToken } = await this.generateTokens(
      refreshTokenDto.user_id,
    );

    this.setRefreshTokenCookie(res, refreshToken);

    return res.send(accessToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post(Routes.Auth.Logout)
  async logout(@Request() req: AuthenticatedRequest): Promise<void> {
    await this.authService.invalidateRefreshToken(req.user.id);
  }

  private async generateTokens(userId: number) {
    return {
      accessToken: await this.authService.generateAccessTokenDto(userId),
      refreshToken: await this.authService.generateRefreshTokenDto(userId),
    };
  }

  private setRefreshTokenCookie(
    res: ExpressResponse,
    refreshToken: RefreshTokenDto,
  ) {
    res.cookie(refreshTokenKey, refreshToken, {
      httpOnly: true,
      maxAge: this.config.get(
        EnvVariables.RefreshTokenValidityInMs,
        EnvDefaults[EnvVariables.RefreshTokenValidityInMs],
      ),
    });
  }
}
