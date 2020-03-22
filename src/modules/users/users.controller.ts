import { ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, UseInterceptors } from '@nestjs/common';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Authorize } from 'src/modules/permissions/decorators/authorize.decorator';
import { ReadAny, ReadOwn } from 'src/modules/permissions/resources/actions';
import { Routes } from '../../routes';
import { Resource } from '../permissions/resources/resource';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller(Routes.Users.Root)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Authorize(ReadOwn(Resource.Password), ReadOwn(Resource.Profile))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(Routes.Users.Self)
  async getOwnProfile(@GetUser() user: User): Promise<User> {
    return user;
  }

  @Authorize(ReadAny(Resource.Profile))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getProfile(@Param('id') id: string): Promise<User> {
    const user: User = await this.usersService.findOne(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }
}
