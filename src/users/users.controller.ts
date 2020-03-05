import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Routes } from './../routes';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller(Routes.Users.Root)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getProfile(@Param('id') id: number): Promise<User> {
    const user: User = await this.usersService.findOne(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }
}
