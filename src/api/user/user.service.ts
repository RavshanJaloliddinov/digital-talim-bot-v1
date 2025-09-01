import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/core/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) { }

  async create(dto: CreateUserDto) {
    const existing = await this.userRepo.findOne({ where: { telegramId: dto.telegramId } });
    if (existing) {
      return {
        message: 'User already exists',
        status: HttpStatus.OK,
        data: existing,
      };
    }


    const user = this.userRepo.create(dto);
    const savedUser = await this.userRepo.save(user);

    return {
      message: 'User created successfully',
      status: HttpStatus.CREATED,
      data: savedUser,
    };
  }

  async createIfNotExists(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.userRepo.findOne({ where: { telegramId: dto.telegramId } });
    if (existing) return existing;
    return this.userRepo.save(dto);
  }

  async findAll() {
    const users = await this.userRepo.find();
    return {
      message: 'All users fetched successfully',
      status: HttpStatus.OK,
      data: users,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      return {
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
        data: null,
      };
    }

    return {
      message: 'User found successfully',
      status: HttpStatus.OK,
      data: user,
    };
  }

  async findByTelegramId(id: string) {
    const user = await this.userRepo.findOne({ where: { telegramId: id } });

    if (!user) {
      return {
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
        data: null,
      };
    }

    return {
      message: 'User found successfully',
      status: HttpStatus.OK,
      data: user,
    };
  }

  async update(id: string, dto: Partial<CreateUserDto>) {
    const result = await this.userRepo.update(id, dto);

    if (result.affected === 0) {
      return {
        message: 'User not found or no changes made',
        status: HttpStatus.NOT_FOUND,
        data: null,
      };
    }

    const updated = await this.findOne(id);
    return {
      message: 'User updated successfully',
      status: HttpStatus.OK,
      data: updated.data,
    };
  }
  async updateNameWithTelegramId(telegramId: string, name: string) {
    const result = await this.userRepo.update({ telegramId }, { name });

    if (result.affected === 0) {
      return {
        message: 'User not found or no changes made',
        status: HttpStatus.NOT_FOUND,
        data: null,
      };
    }

    const updatedUser = await this.userRepo.findOne({ where: { telegramId } });

    return {
      message: 'User updated successfully',
      status: HttpStatus.OK,
      data: updatedUser,
    };
  }



  async remove(id: string) {
    const result = await this.userRepo.delete(id);

    if (result.affected === 0) {
      return {
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
        data: null,
      };
    }

    return {
      message: 'User deleted successfully',
      status: HttpStatus.OK,
      data: null,
    };
  }
}
