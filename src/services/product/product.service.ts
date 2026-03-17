import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateProductDto } from 'src/dto/product/create-product.dto';
import type { UpdateProductDto } from 'src/dto/product/update-product.dto';
import { Product } from 'src/entities/product/product.entity';

@Injectable()
export class ProductService {
  constructor(
    private em: EntityManager,
    @InjectRepository(Product)
    private productRepo: EntityRepository<Product>,
  ) {}

  async create(data: CreateProductDto) {
    const product = this.productRepo.create(data as any);
    await this.em.persistAndFlush(product);
    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    const product = await this.productRepo.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    this.productRepo.assign(product, data as any);
    await this.em.flush();
    return product;
  }

  async delete(id: string) {
    const product = await this.productRepo.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.em.removeAndFlush(product);
    return { message: 'Product deleted successfully' };
  }

  async getById(id: string) {
    const product = await this.productRepo.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findAll() {
    return this.productRepo.findAll();
  }
}
