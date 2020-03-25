import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbError } from '../../../common/exceptions/db-error.enum';
import { Exception } from '../../../common/exceptions/exception.enum';
import { whereIsActive } from '../../../common/util/find-options.util';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
  constructor(private readonly usersService: UsersService) {}

  async findAll(): Promise<Role[]> {
    return Role.find(whereIsActive);
  }

  async findOneOrThrow(id: string): Promise<Role> {
    return Role.findOneOrFail(id, whereIsActive).catch(() => {
      throw new NotFoundException(Exception.ROLE_NOT_FOUND);
    });
  }

  async create(name: string): Promise<Role> {
    const role = new Role();
    role.name = name;

    return role.save();
  }

  async assign(roleId: string, userId: string): Promise<Role> {
    const role: Role = await this.findOneOrThrow(roleId);
    const user: User = await this.usersService.findOneOrThrow(userId);

    const usersProp: keyof Role = 'users';

    try {
      await Role.createQueryBuilder()
        .relation(usersProp)
        .of(role)
        .add(user);
    } catch (err) {
      if (err.code === DbError.UniqueViolation) {
        throw new ConflictException(Exception.ROLE_ALREADY_ASSIGNED_TO_USER);
      } else {
        throw err;
      }
    }

    return role;
  }

  async unassign(roleId: string, userId: string): Promise<Role> {
    const role: Role = await this.findOneOrThrow(roleId);
    const user: User = await this.usersService.findOneOrThrow(userId);

    const usersProp: keyof Role = 'users';

    await Role.createQueryBuilder()
      .relation(usersProp)
      .of(role)
      .remove(user);

    return role;
  }

  async update(roleId: string, roleName: string): Promise<Role> {
    const role: Role = await this.findOneOrThrow(roleId);
    role.name = roleName;
    return role.save();
  }

  async delete(roleId: string): Promise<Role> {
    const role: Role = await this.findOneOrThrow(roleId);
    role.isActive = false;
    return role.save();
  }
}