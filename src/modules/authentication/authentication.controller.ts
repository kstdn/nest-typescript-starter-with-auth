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
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Authorize } from 'src/modules/authorization/decorators/authorize.decorator';
import { UpdateOwn } from 'src/modules/authorization/resources/operations';
import { Resource } from 'src/modules/authorization/resources/resource';
import { envelopeData } from '../../common/util/envelope.util';
import { EnvDefaults } from '../../env.defaults';
import { EnvVariables } from '../../env.variables';
import { Routes } from '../../routes';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import { Authenticate } from './decorators/authenticate.decorator';
import { AccessTokenDto } from './dto/access-token.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { RefreshTokenDto, refreshTokenKey } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller(Routes.Authentication.Root)
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  @Post(Routes.Authentication.Register)
  async register(@Body() user: CreateUserDto): Promise<void> {
    await this.usersService.create(user);
  }

  @Authorize(UpdateOwn(Resource.Password))
  @Patch(Routes.Authentication.ChangePassword)
  async changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.usersService.changePassword(user.id, changePasswordDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post(Routes.Authentication.Login)
  async login(
    @Body() credentials: LoginRequestDto,
    @GetUser() user: User,
    @Res() res: ExpressResponse,
  ): Promise<ExpressResponse> {
    // If we reach this method, this means we passed the username/password auth check

    const accessToken: AccessTokenDto = await this.authService.generateAccessTokenDto(
      user.id,
    );
    const refreshToken: RefreshTokenDto = await this.authService.generateRefreshTokenDto(
      user.id,
    );

    this.setRefreshTokenCookie(res, refreshToken);

    return res.send(envelopeData(accessToken));
  }

  @UseGuards(RefreshTokenGuard)
  @Post(Routes.Authentication.RefreshToken)
  async refreshToken(
    @Request() req: ExpressRequest,
    @Res() res: ExpressResponse,
  ): Promise<ExpressResponse> {
    // If we reach this method, this means we passed the refresh token validity check

    const refreshTokenDto: RefreshTokenDto = req.cookies[refreshTokenKey];

    const accessToken: AccessTokenDto = await this.authService.generateAccessTokenDto(
      refreshTokenDto.userId,
    );
    const newRefreshToken: RefreshTokenDto = await this.authService.generateRefreshTokenDto(
      refreshTokenDto.userId,
    );

    this.setRefreshTokenCookie(res, newRefreshToken);

    return res.send(envelopeData(accessToken));
  }

  @Authenticate()
  @Post(Routes.Authentication.Logout)
  async logout(@GetUser() user: User): Promise<void> {
    await this.authService.logout(user.id);
  }

  private setRefreshTokenCookie(
    res: ExpressResponse,
    refreshToken: RefreshTokenDto,
  ): void {
    res.cookie(refreshTokenKey, refreshToken, {
      httpOnly: true,
      maxAge: this.config.get(
        EnvVariables.RefreshTokenValidityInMs,
        EnvDefaults[EnvVariables.RefreshTokenValidityInMs],
      ),
    });
  }
}
