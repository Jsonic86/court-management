import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUpdateUserSchema } from 'src/dto/user/create-update-user.dto';
import type { CreateUpdateUserDto } from 'src/dto/user/create-update-user.dto';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  findAll() {
    return this.userService.findAll();
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('')
  create(
    @Body(new ZodValidationPipe(CreateUpdateUserSchema))
    data: CreateUpdateUserDto,
  ) {
    return this.userService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Body(new ZodValidationPipe(CreateUpdateUserSchema))
    data: CreateUpdateUserDto,
    @Param('id') id: string,
  ) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getById(id);
  }
}
