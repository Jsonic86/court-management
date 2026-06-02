import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Product {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  slug!: string;

  @Property()
  name!: string;

  @Property()
  description!: string;

  @Property()
  category!: string;

  @Property()
  hero_image_token!: string;

  @Property()
  base_price_cents!: number;

  @Property()
  currency!: string;

  @Property()
  is_published!: boolean;

  @Property()
  primary_template_id!: ObjectId | null;

  @Property()
  status!: number;
}
