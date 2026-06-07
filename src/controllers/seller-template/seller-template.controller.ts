import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { SellerTemplateService } from 'src/services/seller-template/seller-template.service';
import {
  CreateSellerTemplateSchema,
  type CreateSellerTemplate,
} from 'src/dto/seller-template/seller-template.dto';

@Controller('seller-templates')
export class SellerTemplateController {
  constructor(private readonly sellerTemplateService: SellerTemplateService) {}

  @Post('')
  createSellerTemplate(
    @Body(new ZodValidationPipe(CreateSellerTemplateSchema))
    sellerTemplateData: CreateSellerTemplate,
  ) {
    return this.sellerTemplateService.createSellerTemplate(sellerTemplateData);
  }

  @Get('')
  getAllSellerTemplates() {
    return this.sellerTemplateService.getAllSellerTemplates();
  }

  @Get('/:id')
  getSellerTemplateById(@Param('id') id: string) {
    return this.sellerTemplateService.getSellerTemplateById(id);
  }

  @Put('/:id')
  updateSellerTemplate(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateSellerTemplateSchema))
    sellerTemplateData: CreateSellerTemplate,
  ) {
    return this.sellerTemplateService.updateSellerTemplate(
      id,
      sellerTemplateData,
    );
  }

  @Delete('/:id')
  deleteSellerTemplate(@Param('id') id: string) {
    return this.sellerTemplateService.deleteSellerTemplate(id);
  }
}
