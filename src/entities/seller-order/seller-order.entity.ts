import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class SellerOrder {
  @PrimaryKey()
  _id: ObjectId;

  @Property()
  order_number: string;

  @Property()
  customer_user_id: ObjectId | null;

  @Property()
  customer_email: string;

  @Property()
  customer_name: string;

  @Property()
  shipping_address: any;

  @Property()
  billing_address: any;

  @Property()
  subtotal_cents: number;

  @Property()
  shipping_cents: number;

  @Property()
  tax_cents: number;

  @Property()
  total_cents: number;

  @Property()
  currency: string;

  @Property()
  payment_method: string;

  @Property()
  payment_status: number;

  @Property()
  fulfillment_status: number;

  @Property()
  paid_at: Date | null;

  @Property()
  shipped_at: Date | null;

  @Property()
  tracking_number: string | null;

  @Property()
  notes: string | null;

  @Property()
  status: number;
}
