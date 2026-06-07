import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SellerOrderController } from 'src/controllers/seller-order/seller-order.controller';
import { SellerOrder } from 'src/entities/seller-order/seller-order.entity';
import { SellerOrderService } from 'src/services/seller-order/seller-order.service';

@Module({
  imports: [MikroOrmModule.forFeature([SellerOrder])],
  controllers: [SellerOrderController],
  providers: [SellerOrderService],
  exports: [SellerOrderService],
})
export class SellerOrderModule {}
