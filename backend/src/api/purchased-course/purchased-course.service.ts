import { Injectable, NotFoundException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchasedCourseEntity } from 'src/core/purchased-course.entity';
import { CreatePurchasedCourseDto } from './dto/create-purchased-course.dto';
import { FileService } from 'src/infrastructure/file';
import { TelegramFileService } from 'src/infrastructure/telegram_file';
import { PaymentStatus } from 'src/common/database/Enum';
import { BotService } from 'src/bot/bot.service';
import { Telegraf } from 'telegraf';
import { config } from 'src/config';

@Injectable()
export class PurchasedCourseService {
  constructor(
    @InjectRepository(PurchasedCourseEntity)
    private readonly purchasedRepo: Repository<PurchasedCourseEntity>,
    private readonly fileService: FileService,
    private readonly telegramFileService: TelegramFileService,
    private readonly botService: BotService,
  ) { }

  // async create(dto: CreatePurchasedCourseDto, file?: Express.Multer.File) {
  //   let checkImageFileName = '';

  //   if (file) {
  //     checkImageFileName = await this.fileService.saveFile(file);
  //   }

  //   const newPurchase = this.purchasedRepo.create({
  //     ...dto,
  //     status: dto.status ?? 'pending',
  //     checkImage: checkImageFileName,
  //     user: { id: dto.userId },
  //     course: { id: dto.courseId },
  //   });

  //   const saved = await this.purchasedRepo.save(newPurchase);

  //   return {
  //     message: 'Course purchased successfully. Awaiting verification.',
  //     status: HttpStatus.CREATED,
  //     data: saved,
  //   };
  // }

  async create(dto: CreatePurchasedCourseDto & { fileId?: string }, file?: Express.Multer.File) {
    let checkImageFileName = '';

    if (file) {
      checkImageFileName = await this.fileService.saveFile(file);
    } else if (dto.fileId) {
      checkImageFileName = await this.telegramFileService.downloadTelegramFile(dto.fileId);
    }

    const newPurchase = this.purchasedRepo.create({
      ...dto,
      checkImage: checkImageFileName,
      user: { id: dto.userId },
      course: { id: dto.courseId },
    });

    const saved = await this.purchasedRepo.save(newPurchase);

    return {
      message: 'Course purchased successfully',
      status: HttpStatus.CREATED,
      data: saved,
    };
  }




  async findAll() {
    const list = await this.purchasedRepo.find({
      relations: ['user', 'course'],
    });
    return {
      message: 'All purchased courses retrieved',
      status: HttpStatus.OK,
      data: list,
    };
  }

  async findWithStatus(status: PaymentStatus) {
    const list = await this.purchasedRepo.find({
      where: { status },
      relations: ['user', 'course'],
    });
    return {
      message: 'All pending payments',
      status: HttpStatus.OK,
      data: list,
    };
  }

  async findOne(id: string) {
    const item = await this.purchasedRepo.findOne({
      where: { id },
      relations: ['user', 'course'],
    });

    if (!item) throw new NotFoundException('Purchased course not found');

    return {
      message: 'Purchased course found',
      status: HttpStatus.OK,
      data: item,
    };
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.purchasedRepo.remove(item.data);
    return {
      message: 'Purchased course deleted successfully',
      status: HttpStatus.OK,
      data: null,
    };
  }

  async findAllByCourseId(courseId: string) {
    const purchases = await this.purchasedRepo.find({
      where: { course: { id: courseId } },
      relations: ['user', 'course'],
    });

    return {
      message: 'Purchased users for the course retrieved successfully.',
      status: HttpStatus.OK,
      data: purchases,
    };
  }

  async updateStatus(id: string, status: PaymentStatus) {
    const item = await this.purchasedRepo.findOne({
      where: { id },
      relations: ['user', 'course'],
    });

    if (!item) {
      throw new NotFoundException('Purchased course not found');
    }

    item.status = status;
    const updated = await this.purchasedRepo.save(item);

    // ✅ Telegram orqali foydalanuvchiga habar yuborish:
    try {
      const telegramId = item.user.telegramId;
      if (telegramId) {
        const bot = this.botService.getBot(); // BotService dan olinadi

        let message = '';

        if (status === PaymentStatus.VERIFIED) {
          // 📌 Kursga aloqador kanal yoki group username/ID (masalan: -1001234567890 yoki '@kurs_kanal')
          const chatId = "@sport_bulungur";

          // ❗ Bir martalik silka yaratish (faqat bitta odam ishlatishi mumkin, 10 daqiqa amal qiladi)
          const inviteLink = await bot.telegram.createChatInviteLink(chatId, {
            expire_date: Math.floor(Date.now() / 1000) + 60 * 60 * 48, // 10 daqiqaga amal qiladi
            member_limit: 1, // faqat 1 foydalanuvchi kira oladi
          });

          message = `✅ To‘lovingiz tasdiqlandi! Kursga kirish uchun quyidagi havoladan foydalaning:\n\n${inviteLink.invite_link}`;
        } else if (status === PaymentStatus.UNVERFIIED) {
          message = '❌ To‘lovingiz rad etildi. Iltimos, qaytadan urinib ko‘ring.';
        } else {
          message = `ℹ️ To‘lov statusi: ${status}`;
        }

        await bot.telegram.sendMessage(
          telegramId,
          message,
          { disable_web_page_preview: true } as any);
      }
    } catch (err) {
      console.error('Telegramga habar yuborishda xatolik:', err);
    }

    return {
      message: 'Purchased course status updated successfully',
      status: HttpStatus.OK,
      data: updated,
    };
  }

}
