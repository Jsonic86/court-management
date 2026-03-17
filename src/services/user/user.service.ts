import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateUpdateUserDto } from 'src/dto/user/create-update-user.dto';
import { User } from 'src/entities/user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
  ) {}

  async findAll() {
    return this.userRepo.findAll();
  }

  async create(data: CreateUpdateUserDto) {
    const saltRounds = 10;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, saltRounds);
    }
    const user = this.userRepo.create({
      ...data,
      password: data.password,
    } as any);
    await this.em.persistAndFlush(user);
    return user;
  }

  async update(id: string, data: CreateUpdateUserDto) {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (data.password) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }
    this.userRepo.assign(user, data);
    await this.em.flush();
    return user;
  }

  async getById(id: string) {
    return this.userRepo.findOne(id);
  }

  async getByEmail(email: string) {
    return this.userRepo.findOne({ email });
  }

  async delete(id: string) {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    await this.em.removeAndFlush(user);
  }
}
