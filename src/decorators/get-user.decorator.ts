import { createParamDecorator } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/modules/auth/dto/authenticated-request.dto';

export const GetUser = createParamDecorator(
  (data: unknown, request: AuthenticatedRequest) => {
    return request.user;
  },
);
