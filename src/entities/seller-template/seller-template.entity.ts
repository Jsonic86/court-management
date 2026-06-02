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
  public_id!: string;

  @Property()
  source_design_id!: string;

  @Property()
  created_by_user_id!: string;

  @Property()
  name!: string;

  @Property()
  description!: string;

  @Property()
  product_id!: ObjectId | null;

  @Property()
  width_in!: number;

  @Property()
  height_in!: number;

  @Property()
  ppi!: number;

  @Property()
  cut_path_svg!: string | null;

  @Property()
  layers!: SellerLayer[];

  @Property()
  layer_count!: number;

  @Property()
  total_bytes!: number;

  @Property()
  is_active!: boolean;

  @Property()
  published_at!: Date | null;

  @Property()
  status!: number;
}
