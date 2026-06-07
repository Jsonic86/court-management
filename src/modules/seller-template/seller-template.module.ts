import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SellerTemplateController } from 'src/controllers/seller-template/seller-template.controller';
import { SellerTemplate } from 'src/entities/seller-template/seller-template.entity';
import { SellerTemplateService } from 'src/services/seller-template/seller-template.service';

@Module({
  imports: [MikroOrmModule.forFeature([SellerTemplate])],
  controllers: [SellerTemplateController],
  providers: [SellerTemplateService],
  exports: [SellerTemplateService],
})
export class SellerTemplateModule {}
