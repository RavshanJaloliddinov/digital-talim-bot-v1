import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasedCourseEntity } from 'src/core/purchased-course.entity';
import { PurchasedCourseController } from './purchased-course.controller';
import { PurchasedCourseService } from './purchased-course.service'; 
import { FileService } from 'src/infrastructure/file';
import { TelegramFileService } from 'src/infrastructure/telegram_file';
import { BotModule } from 'src/bot/bot.module';

@Module({ 
  imports: [
    TypeOrmModule.forFeature([PurchasedCourseEntity]),
    forwardRef(() => BotModule), // 👈 MUHIM
  ],
  controllers: [PurchasedCourseController],
  providers: [PurchasedCourseService, FileService, TelegramFileService],
  exports: [PurchasedCourseService],
})
export class PurchasedCourseModule {}
