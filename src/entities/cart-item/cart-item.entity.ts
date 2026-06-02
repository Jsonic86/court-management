import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class CartItem {
  @PrimaryKey()
  _id: ObjectId;

  @Property()
  cart_id: ObjectId;

  @Property()
  seller_template_id: ObjectId;

  @Property()
  template_snapshot: any;

  @Property()
  overrides: any;

  @Property()
  thumbnail_storage_key: string | null;

  @Property()
  quantity: number;

  @Property()
  unit_price_cents: number;

  @Property()
  currency: string;

  @Property()
  added_at: Date;
}
