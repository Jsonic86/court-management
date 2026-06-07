import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class CartItem {
  @PrimaryKey()
  _id: ObjectId;

  @Property()
  cartId: ObjectId;

  @Property()
  sellerTemplateId: ObjectId;

  @Property()
  templateSnapshot: any;

  @Property()
  overrides: any;

  @Property()
  thumbnailStorageKey: string | null;

  @Property()
  quantity: number;

  @Property()
  unitPriceCents: number;

  @Property()
  currency: string;

  @Property()
  addedAt: Date;
}
