import { PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export class SellerTemplateAsset {
  @PrimaryKey()
  _id: ObjectId;

  @Property()
  sellerTemplateId: ObjectId;

  @Property()
  layerId: string;

  @Property()
  pngStorageKey: string;

  @Property()
  widthPx: number;

  @Property()
  heightPx: number;

  @Property()
  byteSize: number;
}
