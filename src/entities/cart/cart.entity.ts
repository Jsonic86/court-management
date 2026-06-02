import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Cart {
  @PrimaryKey()
  _id: ObjectId;

  @Property()
  public_id: string;

  @Property()
  customer_user_id: ObjectId | null;

  @Property()
  currency: string;

  @Property()
  status: number;

  @Property()
  expires_at: Date;
}
