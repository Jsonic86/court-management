import { Module } from '@nestjs/common';
import { ImageService } from 'src/services/image/image.service';
import { ImageController } from 'src/controllers/image/image.controller';

@Module({
    controllers: [ImageController],
    providers: [ImageService],
    exports: [ImageService],
})
export class ImageModule {}
