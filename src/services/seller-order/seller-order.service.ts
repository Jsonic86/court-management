import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ObjectId } from '@mikro-orm/mongodb';
import { SellerOrder } from 'src/entities/seller-order/seller-order.entity';
import type {
  CreateSellerOrder,
  UpdateSellerOrder,
} from 'src/dto/seller-order/seller-order.dto';

@Injectable()
export class SellerOrderService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(SellerOrder)
    private readonly sellerOrderRepo: EntityRepository<SellerOrder>,
  ) {}
  async createSellerOrder(
    sellerOrderData: CreateSellerOrder,
  ): Promise<SellerOrder> {
    const sellerOrder = this.sellerOrderRepo.create({
      ...sellerOrderData,
      customerUserId: sellerOrderData.customerUserId
        ? new ObjectId(sellerOrderData.customerUserId)
        : null,
    });
    await this.em.persist(sellerOrder).flush();
    return sellerOrder;
  }

  async getSellerOrder(id: string) {
    return await this.sellerOrderRepo.findOne({ _id: new ObjectId(id) });
  }
  async getSellerOrders(): Promise<SellerOrder[]> {
    return await this.sellerOrderRepo.findAll();
  }
  async updateSellerOrder(
    id: string,
    sellerOrderData: UpdateSellerOrder,
  ): Promise<void> {
    const sellerOrder = await this.sellerOrderRepo.findOne({
      _id: new ObjectId(id),
    });
    if (!sellerOrder) {
      throw new Error('Seller order not found');
    }
    Object.assign(sellerOrder, sellerOrderData);
    return this.em.flush();
  }
  async deleteSellerOrder(id: string): Promise<void> {
    const sellerOrder = await this.sellerOrderRepo.findOne({
      _id: new ObjectId(id),
    });
    if (!sellerOrder) {
      throw new Error('Seller order not found');
    }
    return this.em.remove(sellerOrder).flush();
  }
}
