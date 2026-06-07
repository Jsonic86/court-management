import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateSellerOrderSchema } from 'src/dto/seller-order/seller-order.dto';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import type { CreateSellerOrder } from '../../dto/seller-order/seller-order.dto';
import { SellerOrderService } from 'src/services/seller-order/seller-order.service';

@Controller('seller-orders')
export class SellerOrderController {
  constructor(private readonly sellerOrderService: SellerOrderService) {}

  @Post('')
  createSellerOrder(
    @Body(new ZodValidationPipe(CreateSellerOrderSchema))
    sellerOrderData: CreateSellerOrder,
  ) {
    return this.sellerOrderService.createSellerOrder(sellerOrderData);
  }

  @Get('')
  getAllSellerOrders() {
    return this.sellerOrderService.getSellerOrders();
  }

  @Get('/:id')
  getSellerOrder(@Param('id') id: string) {
    return this.sellerOrderService.getSellerOrder(id);
  }

  @Put('/:id')
  updateSellerOrder(
    @Param('id') id: string,
    @Body() sellerOrderData: CreateSellerOrder,
  ) {
    return this.sellerOrderService.updateSellerOrder(id, sellerOrderData);
  }

  @Delete('/:id')
  deleteSellerOrder(@Param('id') id: string) {
    return this.sellerOrderService.deleteSellerOrder(id);
  }
}
