import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Routes } from '../../routes';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller(Routes.Users.Root)
@UseGuards(PermissionsGuard) // this will be executed third
@UseGuards(RolesGuard) // this will be executed second
@UseGuards(JwtAuthGuard) // this will be executed first
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('self')
  async getOwnProfile(@GetUser() user: User): Promise<User> {
    return user;
  }

  @Roles('admin')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getProfile(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user: User = await this.usersService.findOne(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }
}
