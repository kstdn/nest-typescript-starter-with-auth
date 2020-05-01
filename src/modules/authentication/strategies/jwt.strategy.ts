import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { EnvVariables } from '../../../env.variables';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { JWTPayloadDto } from '../dto/jwt-payload.dto';
import { accessTokenHeaderPayloadKey, accessTokenSignatureKey } from '../dto/access-token.dto';
import { joinJwtToken } from '../../../common/util/jwt.util';

const cookieExtractor = (req: Request): string => {
  let headerAndPayload = '';
  let signature = '';
  if (req && req.cookies) {
    headerAndPayload = req.cookies[accessTokenHeaderPayloadKey];
    signature = req.cookies[accessTokenSignatureKey];
  }
  return joinJwtToken(headerAndPayload, signature);
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly config: ConfigService,
    readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: config.get(EnvVariables.JwtSecret),
    });
  }

  async validate(payload: JWTPayloadDto): Promise<User> {
    return await this.usersService.findOneOrThrow(payload.sub);
  }
}
