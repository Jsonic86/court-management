import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class SellerOrderItem {
  @PrimaryKey()
  _id: ObjectId;

  @Property()
  sellerOrderId: ObjectId;

  @Property()
  sellerTemplateId: ObjectId;

  @Property()
  templateSnapshot: any;

  @Property()
  overrides: any;

  @Property()
  quantity: number;

  @Property()
  unitPriceCents: number;

  @Property()
  lineTotalCents: number;

  @Property()
  printPngToken: ObjectId | null;

  @Property()
  cutSvgToken: ObjectId | null;

  @Property()
  previewPngToken: ObjectId | null;

  @Property()
  productionStatus: number;
}
