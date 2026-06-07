import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Cart {
  @PrimaryKey()
  _id: ObjectId;

  @Property()
  publicId: string;

  @Property()
  customerUserId: ObjectId | null;

  @Property()
  currency: string;

  @Property()
  status: number;

  @Property()
  expiresAt: Date;
}
