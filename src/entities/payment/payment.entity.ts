import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Payment {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  bookingId!: ObjectId;

  @Property()
  amount!: number;

  @Property()
  method!: string;

  @Property({ default: 'pending' })
  status!: string;

  @Property()
  createdAt: Date = new Date();
}
