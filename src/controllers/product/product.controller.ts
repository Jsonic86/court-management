import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductSchema } from 'src/dto/product/product.dto';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { ProductService } from 'src/services/product/product.service';
import z from 'zod';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('')
  createProduct(
    @Body(new ZodValidationPipe(CreateProductSchema))
    productData: z.infer<typeof CreateProductSchema>,
  ) {
    return this.productService.createProduct(productData);
  }

  @Get('/:id')
  getProduct(@Param('id') id: string) {
    return this.productService.getProduct(id);
  }

  @Get('')
  getProducts() {
    return this.productService.getProducts();
  }

  @Put('/:id')
  updateProduct(@Param('id') id: string, @Body() productData: any) {
    return this.productService.updateProduct(id, productData);
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
