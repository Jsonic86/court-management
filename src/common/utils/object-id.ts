import { BadRequestException } from '@nestjs/common';
import { ObjectId } from '@mikro-orm/mongodb';

/**
 * Chuyển string → ObjectId, ném 400 (thay vì BSONError 500) nếu id sai định dạng.
 * Dùng cho param id lấy từ URL.
 */
export function toObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new BadRequestException(`Id không hợp lệ: ${id}`);
  }
  return new ObjectId(id);
}

/**
 * Như toObjectId nhưng cho field optional: '' / null / undefined → null,
 * còn lại validate như thường. Dùng cho field ObjectId nhận từ DTO.
 */
export function toObjectIdOrNull(id: string | null | undefined): ObjectId | null {
  if (id === null || id === undefined || id === '') {
    return null;
  }
  return toObjectId(id);
}
