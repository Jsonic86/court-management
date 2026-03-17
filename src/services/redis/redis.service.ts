import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // Hàm 1: Khóa sân với SETNX (Set if Not eXists) và TTL (Time to live)
  async lockCourt(courtId: string, timeSlot: string, userId: string, ttlSeconds: number = 300) {
    const key = `hold_court:${courtId}:${timeSlot}`;
    
    // Lệnh này nghĩa là:
    // Lưu key với value là userId.
    // 'EX', ttlSeconds: Tự hủy sau 300s (5 phút).
    // 'NX': CHỈ lưu thành công nếu key này CHƯA TỒN TẠI.
    const result = await this.redisClient.set(key, userId, 'EX', ttlSeconds, 'NX');
    
    // Nếu result === 'OK' -> Khóa thành công (sân đang trống)
    // Nếu result === null -> Khóa thất bại (đã có người nhanh tay hơn giữ sân này rồi)
    return result === 'OK';
  }

  // Hàm 2: Mở khóa sân (khi thanh toán xong hoặc người dùng chủ động hủy)
  async unlockCourt(courtId: string, timeSlot: string) {
    const key = `hold_court:${courtId}:${timeSlot}`;
    await this.redisClient.del(key);
  }

  // Hàm 3: Kiểm tra xem sân có đang bị ai khóa không
  async checkCourtStatus(courtId: string, timeSlot: string) {
    const key = `hold_court:${courtId}:${timeSlot}`;
    const userIdHolding = await this.redisClient.get(key);
    return userIdHolding; // Trả về ID người đang giữ, hoặc null nếu trống
  }
}