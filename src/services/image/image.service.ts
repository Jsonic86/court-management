import { Injectable, InternalServerErrorException } from '@nestjs/common';
import cloudinary from '../../config/cloudinary.config';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import streamifier from 'buffer-to-stream';

@Injectable()
export class ImageService {

// Phương thức upload từ Buffer ảnh (không dùng filePath)
  async uploadImageFromBuffer(buffer: Buffer): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'my_app_images', 
          use_filename: true, 
        },
        (error, result) => {
          if (error) {
            reject(new InternalServerErrorException('Lỗi khi upload ảnh.'));
          } else {
            resolve(result!);
          }
        }
      );

      streamifier(buffer).pipe(uploadStream);
    });
  }
}