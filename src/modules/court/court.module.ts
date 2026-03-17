import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { CourtController } from 'src/controllers/court/court.controller';
import { Court } from 'src/entities/court/court.entity';
import { CourtService } from 'src/services/court/court.service';
import { BookingModule } from '../booking/booking.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Court]),
    forwardRef(() => BookingModule),
    ImageModule 
  ],
  controllers: [CourtController],
  providers: [CourtService],
  exports: [CourtService],
})
export class CourtModule {}
