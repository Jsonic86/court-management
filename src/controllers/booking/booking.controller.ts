import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { bookingSchema } from 'src/dto/booking/create-update-booking.dto';
import type { CreateUpdateBooking } from 'src/dto/booking/create-update-booking.dto';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { BookingService } from 'src/services/booking/booking.service';
import { RedisService } from 'src/services/redis/redis.service';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService,
    private redisService: RedisService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createBooking(
    @Body(new ZodValidationPipe(bookingSchema)) data: CreateUpdateBooking,
    @CurrentUser('sub') currentUserId: string,
  ) {
    return this.bookingService.createBooking(data, currentUserId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('my-bookings')
  getMyBooking(@CurrentUser('sub') currentUserId: string) {
    return this.bookingService.getMyBooking(currentUserId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  deleteBooking(
    @CurrentUser('sub') currentUserId: string,
    @Body('id') id: string,
  ) {
    return this.bookingService.deleteBooking(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('hold')
  async holdCourtForPayment(@Body() body: { courtId: string, timeSlot: string, userId: string }) {
    
    // Gọi Redis để cố gắng khóa sân trong 5 phút (300 giây)
    const isLocked = await this.redisService.lockCourt(body.courtId, body.timeSlot, body.userId, 300);

    if (!isLocked) {
      throw new BadRequestException('Rất tiếc, sân này vừa bị người khác giữ chỗ. Vui lòng chọn sân khác!');
    }

    return {
      message: 'Giữ sân thành công. Bạn có 5 phút để thanh toán!',
      expiresIn: '5 minutes'
    };
  }
}
