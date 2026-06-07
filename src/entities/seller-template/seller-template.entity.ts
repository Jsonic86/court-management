import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export type ViewBox = { x: number; y: number; width: number; height: number };

export interface AssetOption {
  id: string;
  label: string;
  thumbnail: string;
  src: string;
}

export interface ColorOption {
  id: string;
  label: string;
  value: string;
}

export type LayerSlotMode =
  | { type: 'fixed' }
  | {
      type: 'text-input';
      maxChars: number;
      defaultText: string;
      allowEmpty?: boolean;
    }
  | { type: 'pick-color'; presets: ColorOption[] }
  | { type: 'pick-asset'; options: AssetOption[] }
  | { type: 'upload-image' }
  /** Khách hàng chọn từ thư viện vector của admin (backend /template/vectors).
   *  Vector được tải xuống dạng SVG → data URL và override layer thành image. */
  | { type: 'pick-vector' };

export interface LayerSlot {
  enabled: boolean;
  label: string;
  helpText?: string;
  mode: LayerSlotMode;
}

type SellerLayer = {
  id: string;
  type: 'path' | 'image' | 'text';
  pathD?: string; // SVG path string nếu là vector/shape
  viewBox?: ViewBox; // pre-computed bounds
  imageSrc?: string; // base64 / URL nếu raster
  text?: { content: string; font: string; size: number; color: string };
  transform: { x: number; y: number; w: number; h: number; rotation: number };
  fill?: string;
  stroke?: { color: string; width: number };
  slot?: LayerSlot; // mang nguyên từ admin
};

@Entity()
export class SellerTemplate {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  publicId!: string;

  @Property()
  sourceDesignId!: string;

  @Property()
  createdByUserId!: string;

  @Property()
  name!: string;

  @Property()
  description!: string;

  @Property({ nullable: true })
  productId!: ObjectId | null;

  @Property()
  widthIn!: number;

  @Property()
  heightIn!: number;

  @Property()
  ppi!: number;

  @Property({ nullable: true })
  cutPathSvg!: string | null;

  @Property()
  layers!: SellerLayer[];

  @Property()
  layerCount!: number;

  @Property()
  totalBytes!: number;

  @Property()
  isActive!: boolean;

  @Property({ nullable: true })
  publishedAt!: Date | null;

  @Property()
  status!: number;
}
