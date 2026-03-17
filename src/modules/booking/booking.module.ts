import { forwardRef, Module } from '@nestjs/common';
import { BookingController } from 'src/controllers/booking/booking.controller';
import { BookingService } from 'src/services/booking/booking.service';
import { CourtModule } from '../court/court.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Booking } from 'src/entities/booking/booking.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Booking]),
    forwardRef(() => CourtModule),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
