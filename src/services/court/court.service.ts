import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CreateCourtDto } from 'src/dto/court/create-court.dto';
import { Court } from 'src/entities/court/court.entity';
import { BookingService } from '../booking/booking.service';
import { ImageService } from '../image/image.service';

interface BookingTime {
  startTime: string;
  endTime: string;
}

@Injectable()
export class CourtService {
  constructor(
    private em: EntityManager,
    @InjectRepository(Court)
    private courtRepo: EntityRepository<Court>,
    private bookingService: BookingService,
    private imageService: ImageService
  ) {}

  async create(data: CreateCourtDto,file: Express.Multer.File) {
    const {url} = await this.imageService.uploadImageFromBuffer(file.buffer);
    const court = this.courtRepo.create({...data, imageUrl:url } as any);
    await this.em.persistAndFlush(court);
    return court;
  }

  async update(id: string, data: CreateCourtDto) {
    const court = await this.courtRepo.findOne(id);
    if (!court) {
      throw new Error('Court not found');
    }
    this.courtRepo.assign(court, data as any);
    await this.em.flush();
    return court;
  }

  async delete(id: string) {
    const court = await this.courtRepo.findOne(id);
    if (!court) {
      throw new Error('Court not found');
    }
    await this.em.removeAndFlush(court);
  }

  async getById(id: string) {
    return this.courtRepo.findOne(id);
  }

  async findAll() {
    return this.courtRepo.findAll();
  }

  getAvailableSlots(
    bookings: BookingTime[],
    openTime = '08:00',
    closeTime = '22:00',
  ) {
    const available: BookingTime[] = [];

    const sorted = bookings.sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    let prevEnd = openTime;

    for (const booking of sorted) {
      if (booking.startTime > prevEnd) {
        available.push({
          startTime: prevEnd,
          endTime: booking.startTime,
        });
      }

      if (booking.endTime > prevEnd) {
        prevEnd = booking.endTime;
      }
    }

    if (prevEnd < closeTime) {
      available.push({
        startTime: prevEnd,
        endTime: closeTime,
      });
    }

    return available;
  }

  async getAvailableCourts(id: string, date: string): Promise<BookingTime[]> {
    const findCourt = await this.courtRepo.findOne(id);
    if (!findCourt) {
      throw new Error('Court not found');
    }
    const bookings = await this.bookingService.getBookingsByDateAndCourt(
      date,
      findCourt._id.toString(),
    );
    return this.getAvailableSlots(bookings);
  }
}
