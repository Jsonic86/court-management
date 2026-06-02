import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class SellerOrderItem {
  @PrimaryKey()
  _id: ObjectId;

  @Property()
  seller_order_id: ObjectId;

  @Property()
  seller_template_id: ObjectId;

  @Property()
  template_snapshot: any;

  @Property()
  overrides: any;

  @Property()
  quantity: number;

  @Property()
  unit_price_cents: number;

  @Property()
  line_total_cents: number;

  @Property()
  print_png_token: ObjectId | null;

  @Property()
  cut_svg_token: ObjectId | null;

  @Property()
  preview_png_token: ObjectId | null;

  @Property()
  production_status: number;
}
