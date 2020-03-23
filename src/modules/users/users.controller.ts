import { ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, UseInterceptors, ParseUUIDPipe } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Authorize } from 'src/modules/authorization/decorators/authorize.decorator';
import { ReadAny, ReadOwn } from 'src/modules/authorization/resources/operations';
import { Routes } from '../../routes';
import { Resource } from '../authorization/resources/resource';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller(Routes.Users.Root)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Authorize(ReadOwn(Resource.Password), ReadOwn(Resource.Profile))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(Routes.Users.Me)
  async getOwnProfile(@GetUser() user: User): Promise<User> {
    return user;
  }

  @Authorize(ReadAny(Resource.Profile))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getProfile(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const user: User = await this.usersService.findOne(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }
}
