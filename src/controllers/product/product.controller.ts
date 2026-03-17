import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { createProductSchema } from 'src/dto/product/create-product.dto';
import type { CreateProductDto } from 'src/dto/product/create-product.dto';
import { updateProductSchema } from 'src/dto/product/update-product.dto';
import type { UpdateProductDto } from 'src/dto/product/update-product.dto';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { ProductService } from 'src/services/product/product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body(new ZodValidationPipe(createProductSchema)) data: CreateProductDto) {
    return this.productService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Body(new ZodValidationPipe(updateProductSchema)) data: UpdateProductDto,
    @Param('id') id: string,
  ) {
    return this.productService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.productService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll() {
    return this.productService.findAll();
  }
}
