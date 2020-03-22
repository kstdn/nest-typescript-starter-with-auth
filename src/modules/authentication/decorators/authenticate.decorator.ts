import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';

export function Authenticate(): any {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
