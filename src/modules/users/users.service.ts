import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, getManager, Repository } from 'typeorm';
import { Exception } from '../../common/exceptions/exception.enum';
import { whereIsActive } from '../../common/util/find-options.util';
import { createHash } from '../../common/util/hash.util';
import { ResourcePermission } from '../authorization/entities/resource-permission.entity';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { PaginationOptions, Paginated } from 'src/common/util/pagination';
import { FilteringOptions } from 'src/common/util/filtering';
import { OrderingOptions } from 'src/common/util/ordering';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const hash: string = await createHash(user.password);
    const createdUser = this.usersRepository.create({
      username: user.username,
      email: user.email,
      passwordHash: hash,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return this.usersRepository.save(createdUser);
  }

  async update(id: string, partialUser: Partial<User>): Promise<User> {
    const user: User = await this.findOneOrThrow(id);
    const updatedUser = { ...user, ...partialUser };
    return this.usersRepository.save(updatedUser);
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user: User = await this.findOneOrThrow(id);
    user.passwordHash = await createHash(changePasswordDto.newPassword);

    await this.usersRepository.save(user);
    await this.refreshTokenService.invalidateRefreshToken(user.id);
  }

  findAllPaginated(
    paginationOptions: PaginationOptions,
    filteringOptions: FilteringOptions,
    orderingOptions: OrderingOptions,
  ): Promise<Paginated<User>> {
    return User.findAllPaginated<User>(
      filteringOptions,
      paginationOptions,
      orderingOptions,
    );
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ username, isActive: true });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email, isActive: true });
  }

  async findOneOrThrow(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail(id, whereIsActive).catch(() => {
      throw new NotFoundException(Exception.USER_NOT_FOUND);
    });
  }

  async delete(id: string): Promise<User> {
    const user = await this.findOneOrThrow(id);
    user.isActive = false;
    return user.save();
  }

  async getAllUserRoleNames(id: number): Promise<string[]> {
    const roles: { name: string }[] = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .where('user.id = :id', { id })
      .select('role.name', 'name')
      .getRawMany();

    return roles.map((r): string => r.name);
  }

  async getResourcePermissions(
    id: string,
    resource: string,
  ): Promise<ResourcePermission[]> {
    return getManager()
      .getRepository(ResourcePermission)
      .createQueryBuilder('resourcePermission')
      .leftJoin('resourcePermission.role', 'role')
      .leftJoin('role.users', 'userWithRole')
      .leftJoin('resourcePermission.user', 'userWithPermission')
      .leftJoin('resourcePermission.resource', 'resource')
      .where('resource.name LIKE :resource', { resource: `%${resource}%` })
      .andWhere(
        new Brackets(qb => {
          qb.where('"userWithRole"."id"::VARCHAR LIKE :id', {
            id: `%${id}%`,
          }).orWhere('"userWithPermission"."id"::VARCHAR LIKE :id', {
            id: `%${id}%`,
          });
        }),
      )
      .getMany();
  }
}
