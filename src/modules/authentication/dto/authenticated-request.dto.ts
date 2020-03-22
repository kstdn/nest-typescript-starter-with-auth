import { Request as ExpressRequest } from 'express';
import { User } from '../../users/entities/user.entity';

export interface AuthenticatedRequest extends ExpressRequest {
  user: User;
}
