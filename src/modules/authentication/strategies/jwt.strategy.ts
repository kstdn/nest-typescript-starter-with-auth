import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvVariables } from '../../../env.variables';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { JWTPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly config: ConfigService,
    readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get(EnvVariables.JwtSecret),
    });
  }

  async validate(payload: JWTPayloadDto): Promise<User> {
    return await this.usersService.findOneOrThrow(payload.sub);
  }
}
