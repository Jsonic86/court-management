import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUpdateBooking } from 'src/dto/booking/create-update-booking.dto';
import { Booking } from 'src/entities/booking/booking.entity';
import { CourtService } from '../court/court.service';
import { Court } from 'src/entities/court/court.entity';

@Injectable()
export class BookingService {
  constructor(
    private em: EntityManager,
    @InjectRepository(Booking)
    private bookingRepository: EntityRepository<Booking>,
    @Inject(forwardRef(() => CourtService))
    private courtService: CourtService,
  ) {}

  calculateHours(startTime: string, endTime: string) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours;
  }

  async getMyBooking(currentUserId: string) {
    return await this.bookingRepository.find({ user: currentUserId });
  }

  async getBookingsByDateAndCourt(date: string, courtId: string) {
    return await this.bookingRepository.find({
      bookingDate: date,
      court: courtId,
    });
  }

  async deleteBooking(id: string) {
    const booking = await this.bookingRepository.findOne(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    await this.em.removeAndFlush(booking);
  }

  async createBooking(data: CreateUpdateBooking, currentUserId: string) {
    const findCourt: Court | null = await this.courtService.getById(data.court);
    if (!findCourt) {
      throw new Error('Court not found');
    }
    //check exist booking
    const existingBooking = await this.bookingRepository.findOne({
      court: findCourt._id,
      startTime: { $lt: data.startTime },
      endTime: { $gt: data.endTime },
      bookingDate: data.bookingDate,
    });
    if (existingBooking) {
      throw new Error('Booking already exists for this time slot');
    }

    const totalPrice =
      findCourt.pricePerHour *
      this.calculateHours(data.startTime, data.endTime);
    const booking = this.bookingRepository.create({
      ...data,
      court: findCourt._id,
      user: currentUserId,
      totalPrice,
    } as any);
    await this.em.persistAndFlush(booking);
    return booking;
  }
}
