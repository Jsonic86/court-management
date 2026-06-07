import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class SellerOrder {
  @PrimaryKey()
  _id: ObjectId;

  @Property()
  orderNumber: string;

  @Property({ nullable: true })
  customerUserId: ObjectId | null;

  @Property({ nullable: true })
  customerEmail: string | null;

  @Property({ nullable: true })
  customerName: string | null;

  @Property({ nullable: true })
  shippingAddress: any;

  @Property({ nullable: true })
  billingAddress: any;

  @Property()
  subtotalCents: number;

  @Property()
  shippingCents: number;

  @Property()
  taxCents: number;

  @Property()
  totalCents: number;

  @Property()
  currency: string;

  @Property()
  paymentMethod: string;

  @Property()
  paymentStatus: number;

  @Property()
  fulfillmentStatus: number;

  @Property({ nullable: true })
  paidAt: Date | null;

  @Property({ nullable: true })
  shippedAt: Date | null;

  @Property({ nullable: true })
  trackingNumber: string | null;

  @Property({ nullable: true })
  notes: string | null;

  @Property()
  status: number;
}
