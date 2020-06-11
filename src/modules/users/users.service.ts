import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilteringOptions } from 'src/common/util/filtering';
import { getOrder, OrderingOptions } from 'src/common/util/ordering';
import {
  getPaginated,
  Paginated,
  PaginationOptions,
} from 'src/common/util/pagination';
import { Brackets, getManager, Repository } from 'typeorm';
import { Exception } from '../../common/exceptions/exception.enum';
import { createHash } from '../../common/util/hash.util';
import { ResourcePermission } from '../authorization/entities/resource-permission.entity';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

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

  async findAllPaginated(
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

  async findAllWithRolePaginated(
    roleId: string,
    { limit, page }: PaginationOptions,
    orderingOptions: OrderingOptions,
  ): Promise<Paginated<User>> {

    const order = getOrder(orderingOptions);

    const [items, totalCount] = await User.getRepository()
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .where('role.id = :roleId', { roleId })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(order)
      .getManyAndCount();

    return getPaginated<User>(items, totalCount, page, limit);
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async findOneOrThrow(id: string): Promise<User> {
    return User.findOneOrFail(id).catch(() => {
      throw new NotFoundException(Exception.USER_NOT_FOUND);
    });
  }

  async delete(id: string): Promise<User> {
    const user = await this.findOneOrThrow(id);
    return user.remove();
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
