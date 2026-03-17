import {
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { User } from '../user/user.entity';
import { Court } from '../court/court.entity';

@Entity()
export class Booking {
  @PrimaryKey()
  _id!: ObjectId;

  @ManyToOne(() => User)
  user!: User;

  @ManyToMany(() => Court)
  court!: Court;

  @Property()
  bookingDate!: Date;

  @Property()
  startTime!: string;

  @Property()
  endTime!: string;

  @Property()
  totalPrice!: number;

  @Property({ default: 'pending' })
  status!: string;

  @Property()
  createdAt: Date = new Date();
}
