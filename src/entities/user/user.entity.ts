import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class User {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  name!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  phone!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ default: 'customer' })
  role!: string;

  @Property()
  createdAt: Date = new Date();
}
