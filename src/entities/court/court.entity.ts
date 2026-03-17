import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Court {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  name!: string;

  @Property()
  location!: string;

  @Property()
  pricePerHour!: number;

  @Property({ default: true })
  active!: boolean;

  @Property()
  createdAt: Date = new Date();

  @Property({ nullable: true })
  imageUrl?: string;
}
