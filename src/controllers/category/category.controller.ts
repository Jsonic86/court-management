import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { CategoryService } from 'src/services/category/category.service';
import {
  CreateCategorySchema,
  ListCategoryQuerySchema,
  MoveCategorySchema,
  UpdateCategorySchema,
  type CreateCategory,
  type ListCategoryQuery,
  type MoveCategory,
  type UpdateCategory,
} from 'src/dto/category/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  create(
    @Body(new ZodValidationPipe(CreateCategorySchema)) dto: CreateCategory,
  ) {
    return this.categoryService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCategorySchema)) dto: UpdateCategory,
  ) {
    return this.categoryService.update(id, dto);
  }

  @Post(':id/move')
  move(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(MoveCategorySchema)) dto: MoveCategory,
  ) {
    return this.categoryService.move(id, dto.parentId, dto.position);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.softDelete(id);
  }

  // ── Public ── (khai báo 'tree' TRƯỚC ':id' để không bị nuốt route)
  @Get('tree')
  tree(
    @Query(new ZodValidationPipe(ListCategoryQuerySchema))
    query: ListCategoryQuery,
  ) {
    return this.categoryService.tree(query.publishedOnly);
  }

  @Get('')
  list(
    @Query(new ZodValidationPipe(ListCategoryQuerySchema))
    query: ListCategoryQuery,
  ) {
    return this.categoryService.list(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}
