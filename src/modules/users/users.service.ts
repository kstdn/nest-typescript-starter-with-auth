import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getManager, Repository } from 'typeorm';
import { createHash } from '../../common/util/hash.util';
import { BasePermissionEntity } from '../authorization/entities/base-permission.entity';
import { ResourcePermissionToRole } from '../authorization/entities/permission-to-role.entity';
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
    const user: User = await this.findOne(id);
    const updatedUser = { ...user, ...partialUser };
    return this.usersRepository.save(updatedUser);
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user: User = await this.findOne(id);
    user.passwordHash = await createHash(changePasswordDto.newPassword);

    await this.usersRepository.save(user);
    await this.refreshTokenService.invalidateRefreshToken(user.id);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
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

  async getResourcePermissionToUser(
    id: string,
    resource: string,
  ): Promise<BasePermissionEntity> {
    return getManager()
      .getRepository(ResourcePermissionToRole)
      .createQueryBuilder('resourcePermission')
      .leftJoin('resourcePermission.resource', 'resource')
      .leftJoin('resourcePermission.role', 'role')
      .leftJoin('role.users', 'user')
      .where('"user"."id"::VARCHAR LIKE :id', { id: `%${id}%` })
      .andWhere('resource.name LIKE :resource', { resource: `%${resource}%` })
      .getOne();
  }
}
