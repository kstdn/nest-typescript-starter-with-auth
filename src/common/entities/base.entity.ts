import {
  BaseEntity,
  Column,
  CreateDateColumn,
  FindManyOptions,
  ObjectType,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { FilteringOptions, getFilters } from '../util/filtering';
import { getOrder, OrderingOptions } from '../util/ordering';
import { getPaginated, Paginated, PaginationOptions } from '../util/pagination';

export class BaseDBEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @VersionColumn()
  version: number;

  static async findAllPaginated<T extends BaseDBEntity>(
    this: ObjectType<T>,
    filteringOptions: FilteringOptions,
    { limit, page }: PaginationOptions,
    orderingOptions: OrderingOptions,
    options?: FindManyOptions<T>,
  ): Promise<Paginated<T>> {
    const where = getFilters(filteringOptions);
    const order = getOrder(orderingOptions);

    const [items, totalCount] = await (this as any).findAndCount({
      ...options,
      skip: (page - 1) * limit,
      take: limit,
      order,
      where,
    });

    return getPaginated<T>(items, totalCount, page, limit);
  }
}
