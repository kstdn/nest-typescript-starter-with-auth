import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ResourcePermission } from './entities/resource-permission.entity';
import { Resource } from './entities/resource.entity';
import { Role } from './entities/role.entity';
import { PermissionsController } from './controllers/permissions.controller';
import { RolesController } from './controllers/roles.controller';
import { PermissionsService } from './services/permissions.service';
import { ResourcesService } from './services/resources.service';
import { RolesService } from './services/roles.service';
import { ResourcesController } from './controllers/resources.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourcePermission, Resource, Role]),
    UsersModule,
  ],
  providers: [PermissionsService, ResourcesService, RolesService],
  exports: [],
  controllers: [PermissionsController, ResourcesController, RolesController],
})
export class AuthorizationModule {}
