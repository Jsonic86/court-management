import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CategoryController } from 'src/controllers/category/category.controller';
import { Category } from 'src/entities/category/category.entity';
import { CategoryService } from 'src/services/category/category.service';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
