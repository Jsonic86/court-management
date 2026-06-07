import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ProductController } from 'src/controllers/product/product.controller';
import { Product } from 'src/entities/product/product.entity';
import { ProductService } from 'src/services/product/product.service';

@Module({
  imports: [MikroOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
