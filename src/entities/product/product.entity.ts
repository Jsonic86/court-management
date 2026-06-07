import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export interface ProductVariant {
  id: string;
  label: string;
}

export interface ColorSwatch {
  id: string;
  label: string;
  // CSS color, gradient, hoặc image-url(...) cho fabric pattern.
  swatch: string;
  selected?: boolean;
}

export interface QuoteOption {
  id: string;
  label: string;
}

@Entity()
export class Product {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  slug!: string;

  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property()
  category!: string;

  @Property()
  breadcrumb: string[] = [];

  @Property()
  rating!: number;

  @Property()
  reviews!: number;

  @Property({ nullable: true })
  soldText?: string;

  @Property()
  priceCents!: number;

  @Property({ nullable: true })
  originalPriceCents?: number;

  @Property()
  currency!: string;

  @Property()
  image!: string;

  @Property()
  thumbs: string[] = [];

  @Property()
  variants!: ProductVariant[];

  @Property()
  sizes!: string[];

  @Property()
  colors!: ColorSwatch[];

  @Property()
  quotes!: QuoteOption[];

  @Property()
  shipsTo!: string;

  @Property()
  arrivalRange!: string;

  @Property()
  isPublished!: boolean;

  @Property({ nullable: true })
  primaryTemplateId!: ObjectId | null;

  @Property()
  status!: number;
}
