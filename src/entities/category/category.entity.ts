import {
  Entity,
  Index,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

/**
 * Danh mục tự tham chiếu (cây). Trên MongoDB dùng materialized path:
 * - `ancestors`: mảng id tổ tiên [root..parent] (KHÔNG gồm chính nó) → query con cháu 1 phát.
 * - `breadcrumb`: mảng TÊN hiển thị, GỒM cả chính nó (vd ["Gifts","For Her","Birthday"]).
 * Cả 2 do BE tính & lưu (denorm); FE chỉ đọc.
 *
 * status: 0 = active, 1 = soft-deleted.
 */
@Entity()
export class Category {
  /** Field tự quản lý → bỏ khỏi RequiredEntityData khi gọi create(). */
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  _id: ObjectId;

  // Không đặt unique ở DB: slug chỉ unique trong status=0 (check ở service),
  // soft-deleted vẫn giữ slug cũ. Index thường để lookup nhanh.
  @Index()
  @Property()
  slug: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Index()
  @Property({ nullable: true })
  parentId: ObjectId | null = null;

  @Index()
  @Property()
  ancestors: ObjectId[] = [];

  @Property()
  breadcrumb: string[] = [];

  @Property()
  productCount: number = 0;

  @Property({ nullable: true })
  image?: string;

  @Property({ nullable: true })
  icon?: string;

  @Property()
  sortOrder: number = 0;

  @Index()
  @Property()
  isPublished: boolean = true;

  @Property()
  status: number = 0;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
