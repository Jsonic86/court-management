import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ObjectId } from '@mikro-orm/mongodb';
import { Category } from 'src/entities/category/category.entity';
import { toObjectId } from 'src/common/utils/object-id';
import type {
  CreateCategory,
  ListCategoryQuery,
  UpdateCategory,
} from 'src/dto/category/category.dto';

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

@Injectable()
export class CategoryService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
  ) {}

  // ───────────────────────── Helpers ─────────────────────────

  /** Lấy category active theo id hoặc ném 404. */
  private async getActiveOrThrow(id: ObjectId): Promise<Category> {
    const cat = await this.categoryRepo.findOne({ _id: id, status: 0 });
    if (!cat) {
      throw new NotFoundException('Không tìm thấy category');
    }
    return cat;
  }

  /** parentId (string|null) → Category cha (active) hoặc null. Ném 400 nếu cha không tồn tại. */
  private async resolveParent(
    parentId: string | null | undefined,
  ): Promise<Category | null> {
    if (parentId === null || parentId === undefined || parentId === '') {
      return null;
    }
    const parent = await this.categoryRepo.findOne({
      _id: toObjectId(parentId),
      status: 0,
    });
    if (!parent) {
      throw new BadRequestException('Category cha không tồn tại');
    }
    return parent;
  }

  /** Slug chỉ unique trong status=0. excludeId để bỏ qua chính nó khi update. */
  private async assertSlugUnique(
    slug: string,
    excludeId?: ObjectId,
  ): Promise<void> {
    const existing = await this.categoryRepo.findOne({ slug, status: 0 });
    if (existing && (!excludeId || !existing._id.equals(excludeId))) {
      throw new ConflictException(`Slug "${slug}" đã tồn tại`);
    }
  }

  /**
   * Move `nodeId` xuống dưới `newParentId` có tạo cycle không?
   * Cycle khi: newParent là chính nó, hoặc newParent là con cháu của nó
   * (tức nodeId nằm trong ancestors của newParent).
   */
  private wouldCreateCycle(
    nodeId: ObjectId,
    newParent: Category | null,
  ): boolean {
    if (!newParent) return false;
    if (newParent._id.equals(nodeId)) return true;
    return newParent.ancestors.some((a) => a.equals(nodeId));
  }

  /** Tính ancestors/breadcrumb của 1 node dựa trên cha của nó. */
  private applyPaths(node: Category, parent: Category | null): void {
    node.ancestors = parent ? [...parent.ancestors, parent._id] : [];
    node.breadcrumb = parent ? [...parent.breadcrumb, node.name] : [node.name];
  }

  /**
   * Tính lại ancestors + breadcrumb cho cả subtree gốc `rootId`.
   * 1 query lấy root + toàn bộ con cháu (qua ancestors), rebuild trong RAM, flush ở caller.
   */
  private async recomputeSubtree(rootId: ObjectId): Promise<void> {
    const root = await this.categoryRepo.findOne({ _id: rootId });
    if (!root) return;

    const parent = root.parentId
      ? await this.categoryRepo.findOne({ _id: root.parentId })
      : null;

    // Toàn bộ con cháu (mọi status, để path luôn nhất quán).
    const descendants = await this.categoryRepo.find({ ancestors: rootId });

    // Gom con theo parentId để duyệt cây trong RAM.
    const childrenByParent = new Map<string, Category[]>();
    for (const d of descendants) {
      const key = d.parentId ? d.parentId.toHexString() : '';
      const arr = childrenByParent.get(key) ?? [];
      arr.push(d);
      childrenByParent.set(key, arr);
    }

    const walk = (node: Category, nodeParent: Category | null): void => {
      this.applyPaths(node, nodeParent);
      const children = childrenByParent.get(node._id.toHexString()) ?? [];
      for (const child of children) {
        walk(child, node);
      }
    };

    walk(root, parent);
  }

  // ───────────────────────── Commands ─────────────────────────

  async create(dto: CreateCategory): Promise<Category> {
    await this.assertSlugUnique(dto.slug);
    const parent = await this.resolveParent(dto.parentId);

    const category = this.categoryRepo.create({
      slug: dto.slug,
      name: dto.name,
      description: dto.description,
      parentId: parent?._id ?? null,
      image: dto.image,
      icon: dto.icon,
      isPublished: dto.isPublished,
      // sortOrder: nếu không truyền → đẩy xuống cuối danh sách sibling.
      sortOrder:
        dto.sortOrder ?? (await this.countSiblings(parent?._id ?? null)),
      ancestors: [],
      breadcrumb: [],
      productCount: 0,
      status: 0,
    });
    this.applyPaths(category, parent);

    await this.em.persist(category).flush();
    return category;
  }

  private countSiblings(parentId: ObjectId | null): Promise<number> {
    return this.categoryRepo.count({ parentId, status: 0 });
  }

  async update(id: string, dto: UpdateCategory): Promise<Category> {
    const objId = toObjectId(id);
    const category = await this.getActiveOrThrow(objId);

    if (dto.slug && dto.slug !== category.slug) {
      await this.assertSlugUnique(dto.slug, objId);
      category.slug = dto.slug;
    }

    // Gán field thường.
    if (dto.name !== undefined) category.name = dto.name;
    if (dto.description !== undefined) category.description = dto.description;
    if (dto.image !== undefined) category.image = dto.image;
    if (dto.icon !== undefined) category.icon = dto.icon;
    if (dto.isPublished !== undefined) category.isPublished = dto.isPublished;
    if (dto.sortOrder !== undefined) category.sortOrder = dto.sortOrder;

    // Đổi parent qua PUT (không reorder) → append cuối parent mới.
    let parentChanged = false;
    if (dto.parentId !== undefined) {
      const newParent = await this.resolveParent(dto.parentId);
      const newParentId = newParent?._id ?? null;
      const curParentId = category.parentId;
      const differs =
        (newParentId === null) !== (curParentId === null) ||
        (newParentId && curParentId && !newParentId.equals(curParentId));
      if (differs) {
        if (this.wouldCreateCycle(objId, newParent)) {
          throw new BadRequestException('Thao tác sẽ tạo vòng tròn (cycle)');
        }
        category.parentId = newParentId;
        category.sortOrder = await this.countSiblings(newParentId);
        parentChanged = true;
      }
    }

    // Đổi parent HOẶC đổi name → path của subtree phải tính lại
    // (name đổi ảnh hưởng breadcrumb của con cháu).
    if (parentChanged || dto.name !== undefined) {
      await this.recomputeSubtree(objId);
    }

    await this.em.flush();
    return category;
  }

  /**
   * Move + reorder. KHÔNG bọc em.transactional() vì cần Mongo replica set;
   * trên prod có RS nên bọc lại để an toàn (xem docs Mongo-specific).
   */
  async move(
    id: string,
    newParentIdRaw: string | null,
    position: number,
  ): Promise<Category> {
    const objId = toObjectId(id);
    const node = await this.getActiveOrThrow(objId);
    const newParent = await this.resolveParent(newParentIdRaw);

    if (this.wouldCreateCycle(objId, newParent)) {
      throw new BadRequestException('Move sẽ tạo vòng tròn (cycle)');
    }

    const newParentId = newParent?._id ?? null;

    // Sibling ở parent mới (trừ chính nó), sort theo sortOrder hiện tại.
    const siblings = await this.categoryRepo.find(
      { parentId: newParentId, status: 0, _id: { $ne: objId } },
      { orderBy: { sortOrder: 'asc' } },
    );

    // Clamp position về [0, siblings.length].
    const pos = Math.max(0, Math.min(position, siblings.length));
    siblings.splice(pos, 0, node);

    // Reindex sortOrder + gán parent mới cho node.
    siblings.forEach((sib, i) => {
      sib.sortOrder = i;
    });
    node.parentId = newParentId;

    await this.recomputeSubtree(objId);
    await this.em.flush();
    return node;
  }

  async softDelete(id: string): Promise<void> {
    const objId = toObjectId(id);
    const category = await this.getActiveOrThrow(objId);

    const childCount = await this.categoryRepo.count({
      parentId: objId,
      status: 0,
    });
    if (childCount > 0) {
      throw new ConflictException(
        `Còn ${childCount} category con. Move/xoá con trước.`,
      );
    }
    if (category.productCount > 0) {
      throw new ConflictException(
        `Còn ${category.productCount} sản phẩm. Move sản phẩm sang category khác trước.`,
      );
    }

    category.status = 1;
    await this.em.flush();
  }

  // ───────────────────────── Queries ─────────────────────────

  async findOne(id: string): Promise<Category> {
    return this.getActiveOrThrow(toObjectId(id));
  }

  async list(query: ListCategoryQuery) {
    const where: Record<string, unknown> = { status: 0 };
    if (query.publishedOnly) where.isPublished = true;
    if (query.parentId !== undefined) {
      where.parentId =
        query.parentId === null || query.parentId === ''
          ? null
          : toObjectId(query.parentId);
    }
    if (query.q) where.name = { $regex: query.q, $options: 'i' };

    const [items, total] = await this.categoryRepo.findAndCount(where, {
      orderBy: { [query.sort]: 'asc' },
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    });

    return { items, total, page: query.page, limit: query.limit };
  }

  /** Cây lồng nhau. 1 query lấy hết → build trong RAM (không gọi DB N lần). */
  async tree(publishedOnly: boolean): Promise<CategoryTreeNode[]> {
    const where: Record<string, unknown> = { status: 0 };
    if (publishedOnly) where.isPublished = true;

    const all = await this.categoryRepo.find(where, {
      orderBy: { sortOrder: 'asc' },
    });

    const map = new Map<string, CategoryTreeNode>();
    for (const c of all) {
      map.set(c._id.toHexString(), Object.assign(c, { children: [] }));
    }

    const roots: CategoryTreeNode[] = [];
    for (const node of map.values()) {
      const parentKey = node.parentId?.toHexString();
      const parent = parentKey ? map.get(parentKey) : undefined;
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }
}
