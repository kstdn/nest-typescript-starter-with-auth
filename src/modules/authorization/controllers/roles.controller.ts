import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Routes } from '../../../routes';
import { Authorize } from '../decorators/authorize.decorator';
import { Role } from '../entities/role.entity';
import {
  CreateAny,
  DeleteAny,
  ReadAny,
  UpdateAny,
} from '../resources/operations';
import { Resource } from '../resources/resource';
import { RolesService } from '../services/roles.service';

@Controller(`${Routes.Authorization.Root}/${Routes.Authorization.Roles.Root}`)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Authorize(ReadAny(Resource.Role))
  @Get()
  async getAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Authorize(ReadAny(Resource.Role))
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<Role> {
    return this.rolesService.findOneOrThrow(id);
  }

  @Authorize(CreateAny(Resource.Role))
  @Post()
  async createRole(@Query('name') name: string): Promise<Role> {
    return this.rolesService.create(name);
  }

  @Authorize(UpdateAny(Resource.Role))
  @Post(`:roleId/${Routes.Authorization.Roles.User}/:userId`)
  async assignRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Role> {
    return this.rolesService.assign(roleId, userId);
  }

  @Authorize(UpdateAny(Resource.Role))
  @Delete(`:roleId/${Routes.Authorization.Roles.User}/:userId`)
  async unassignRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Role> {
    return this.rolesService.unassign(roleId, userId);
  }

  @Authorize(UpdateAny(Resource.Role))
  @Patch(':id')
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('name') name: string,
  ): Promise<Role> {
    return this.rolesService.update(id, name);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Authorize(DeleteAny(Resource.Role))
  @Delete(':id')
  async deleteRole(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.rolesService.delete(id);
  }
}
