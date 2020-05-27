import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Authorize } from 'src/modules/authorization/decorators/authorize.decorator';
import {
  DeleteAny,
  ReadAny,
  ReadOwn,
} from 'src/modules/authorization/resources/operations';
import { Routes } from '../../routes';
import { Resource } from '../authorization/resources/resource';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller(Routes.Users.Root)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Authorize(ReadAny(Resource.User))
  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Authorize(ReadOwn(Resource.User))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(Routes.Users.Me)
  async getOwnProfile(@GetUser() user: User): Promise<User> {
    return user;
  }

  @Authorize(ReadAny(Resource.User))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findOneOrThrow(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Authorize(DeleteAny(Resource.User))
  @Delete()
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usersService.delete(id);
  }
}
