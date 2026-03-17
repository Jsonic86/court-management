import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from 'src/services/image/image.service';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

@Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Sử dụng FileInterceptor để nhận file
  async upload(@UploadedFile() file: Express.Multer.File) {
    // file.buffer chứa dữ liệu ảnh dưới dạng raw data (Buffer) trong RAM
    const result = await this.imageService.uploadImageFromBuffer(file.buffer);
    
    // Bạn có thể lưu kết quả.secure_url vào cơ sở dữ liệu
    return {
      message: 'Tải lên thành công!',
      url: result.secure_url,
    };
  }
}