import { PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export class SellerTemplateAsset {
  @PrimaryKey()
  _id: ObjectId;

  @Property()
  seller_template_id: ObjectId;

  @Property()
  layer_id: string;

  @Property()
  png_storage_key: string;

  @Property()
  width_px: number;

  @Property()
  height_px: number;

  @Property()
  byte_size: number;
}
