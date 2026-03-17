import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Product {
  @PrimaryKey()
  _id!: string;

  @Property()
  name!: string;

  @Property()
  category!: string;

  @Property()
  price!: number;

  @Property({ default: 0 })
  stock!: number;

  @Property()
  createdAt: Date = new Date();
}
