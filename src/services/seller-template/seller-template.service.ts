import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ObjectId } from '@mikro-orm/mongodb';
import { SellerTemplate } from 'src/entities/seller-template/seller-template.entity';
import type { CreateSellerTemplate } from 'src/dto/seller-template/seller-template.dto';

@Injectable()
export class SellerTemplateService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(SellerTemplate)
    private readonly sellerTemplateRepo: EntityRepository<SellerTemplate>,
  ) {}

  async createSellerTemplate(
    sellerTemplateData: CreateSellerTemplate,
  ): Promise<SellerTemplate> {
    const sellerTemplate = this.sellerTemplateRepo.create({
      ...sellerTemplateData,
      productId: sellerTemplateData.productId
        ? new ObjectId(sellerTemplateData.productId)
        : null,
    });
    await this.em.persistAndFlush(sellerTemplate);
    return sellerTemplate;
  }

  async getAllSellerTemplates(): Promise<SellerTemplate[]> {
    return this.sellerTemplateRepo.findAll();
  }

  async getSellerTemplateById(id: string): Promise<SellerTemplate> {
    const sellerTemplate = await this.sellerTemplateRepo.findOne({
      _id: new ObjectId(id),
    });
    if (!sellerTemplate) {
      throw new Error(`Seller template with ID ${id} not found`);
    }
    return sellerTemplate;
  }

  async updateSellerTemplate(
    id: string,
    sellerTemplateData: CreateSellerTemplate,
  ): Promise<SellerTemplate> {
    const sellerTemplate = await this.getSellerTemplateById(id);
    Object.assign(sellerTemplate, sellerTemplateData);
    await this.em.persistAndFlush(sellerTemplate);
    return sellerTemplate;
  }

  async deleteSellerTemplate(id: string): Promise<void> {
    const sellerTemplate = await this.getSellerTemplateById(id);
    await this.em.removeAndFlush(sellerTemplate);
  }
}
