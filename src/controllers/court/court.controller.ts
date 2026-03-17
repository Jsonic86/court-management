import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { courtSchema } from 'src/dto/court/create-court.dto';
import type { CreateCourtDto } from 'src/dto/court/create-court.dto';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { CourtService } from 'src/services/court/court.service';

interface BookingTime {
  startTime: string;
  endTime: string;
}

@Controller('court')
export class CourtController {
  constructor(private courtService: CourtService) {}

  //CRUD court
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Body(new ZodValidationPipe(courtSchema)) data: CreateCourtDto,
  @UploadedFile() file: Express.Multer.File
) {
    return this.courtService.create(data, file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Body(new ZodValidationPipe(courtSchema)) data: CreateCourtDto,
    @Param('id') id: string,
  ) {
    return this.courtService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.courtService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.courtService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll() {
    return this.courtService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/available-slots')
  async getAvailableSlots(
    @Param('id') id: string,
    @Query('date') date: string,
  ): Promise<BookingTime[]> {
    return await this.courtService.getAvailableCourts(id, date);
  }
}
