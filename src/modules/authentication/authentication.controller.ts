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
import { splitJwtToken } from '../../common/util/jwt.util';
import { EnvDefaults } from '../../env.defaults';
import { EnvVariables } from '../../env.variables';
import { Routes } from '../../routes';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import { Authenticate } from './decorators/authenticate.decorator';
import {
  accessTokenHeaderPayloadKey,
  accessTokenSignatureKey,
} from './dto/access-token.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import {
  RefreshTokenDto,
  refreshTokenKey,
  refreshTokenPartialKey,
} from './dto/refresh-token.dto';
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

    const accessToken: string = await this.authService.generateAccessToken(
      user.id,
    );
    const refreshToken: RefreshTokenDto = await this.authService.generateRefreshTokenDto(
      user.id,
    );

    this.setAccessTokenCookies(res, accessToken);
    this.setRefreshTokenCookies(res, refreshToken);

    return res.send();
  }

  @UseGuards(RefreshTokenGuard)
  @Post(Routes.Authentication.RefreshToken)
  async refreshToken(
    @Request() req: ExpressRequest,
    @Res() res: ExpressResponse,
  ): Promise<ExpressResponse> {
    // If we reach this method, this means we passed the refresh token validity check

    const refreshTokenDto: RefreshTokenDto = req.cookies[refreshTokenKey];

    const accessToken: string = await this.authService.generateAccessToken(
      refreshTokenDto.userId,
    );
    const newRefreshToken: RefreshTokenDto = await this.authService.generateRefreshTokenDto(
      refreshTokenDto.userId,
    );

    this.setAccessTokenCookies(res, accessToken);
    this.setRefreshTokenCookies(res, newRefreshToken);

    return res.send();
  }

  @Authenticate()
  @Post(Routes.Authentication.Logout)
  async logout(@GetUser() user: User): Promise<void> {
    await this.authService.logout(user.id);
  }

  private setAccessTokenCookies(
    res: ExpressResponse,
    accessToken: string,
  ): void {
    const splitAccessToken = splitJwtToken(accessToken);

    // We send the header and payload as a normal cookie
    // This way the user can read them via javascript
    // It also allows us to logout the user on the client side
    // by deleting this cookie
    res.cookie(accessTokenHeaderPayloadKey, splitAccessToken.headerAndPayload, {
      sameSite: true,
      maxAge: this.config.get(
        EnvVariables.JwtValidityInMs,
        EnvDefaults[EnvVariables.JwtValidityInMs],
      ),
    });

    // We send the signature as HttpOnly and SameSite cookie
    res.cookie(accessTokenSignatureKey, splitAccessToken.signature, {
      httpOnly: true,
      sameSite: true,
      maxAge: this.config.get(
        EnvVariables.JwtValidityInMs,
        EnvDefaults[EnvVariables.JwtValidityInMs],
      ),
    });
  }

  private setRefreshTokenCookies(
    res: ExpressResponse,
    refreshTokenDto: RefreshTokenDto,
  ): void {
    const { refreshToken } = refreshTokenDto;
    const refreshTokenDtoFirstPart = refreshToken.substr(0, 8);
    const refreshTokenDtoSecondPart = refreshToken.substr(8);

    // We send the partial refresh token as a regular cookie
    // This way when we want to logout the user, we can delete this cookie
    // and it will work even if the user is offline
    res.cookie(refreshTokenPartialKey, refreshTokenDtoFirstPart, {
      httpOnly: false,
      sameSite: true,
      maxAge: this.config.get(
        EnvVariables.RefreshTokenValidityInMs,
        EnvDefaults[EnvVariables.RefreshTokenValidityInMs],
      ),
    });

    // We send the userId and the rest of the token as a HttpOnly cookie
    const secureRefreshTokenDto: RefreshTokenDto = {
      userId: refreshTokenDto.userId,
      refreshToken: refreshTokenDtoSecondPart,
    };
    res.cookie(refreshTokenKey, secureRefreshTokenDto, {
      httpOnly: true,
      sameSite: true,
      maxAge: this.config.get(
        EnvVariables.RefreshTokenValidityInMs,
        EnvDefaults[EnvVariables.RefreshTokenValidityInMs],
      ),
    });
  }
}
