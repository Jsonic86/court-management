import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Product } from 'src/entities/product/product.entity';
import type { CreateProduct, UpdateProduct } from 'src/dto/product/product.dto';
import { toObjectId, toObjectIdOrNull } from 'src/common/utils/object-id';

@Injectable()
export class ProductService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
  ) {}
  async createProduct(productData: CreateProduct): Promise<Product> {
    const product = this.productRepo.create({
      ...productData,
      primaryTemplateId: toObjectIdOrNull(productData.primaryTemplateId),
      breadcrumb: productData.breadcrumb ?? [],
      thumbs: productData.thumbs ?? [],
      sizes: productData.sizes ?? [],
    });
    await this.em.persist(product).flush();
    return product;
  }
  async getProduct(id: string) {
    return await this.productRepo.findOne({ _id: toObjectId(id) });
  }
  async getProducts(): Promise<Product[]> {
    return await this.productRepo.findAll();
  }
  async updateProduct(id: string, productData: UpdateProduct): Promise<void> {
    const product = await this.productRepo.findOne({ _id: toObjectId(id) });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    Object.assign(product, productData);
    // primaryTemplateId từ DTO là string → convert nếu được gửi trong body update.
    if (productData.primaryTemplateId !== undefined) {
      product.primaryTemplateId = toObjectIdOrNull(
        productData.primaryTemplateId,
      );
    }
    return this.em.flush();
  }
  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepo.findOne({ _id: toObjectId(id) });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.em.remove(product).flush();
  }
}
