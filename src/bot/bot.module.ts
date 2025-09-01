import { Module, forwardRef } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { UserModule } from 'src/api/user/user.module';
import { CourseModule } from 'src/api/course/course.module';
import { TelegramFileService } from 'src/infrastructure/telegram_file';
import { PurchasedCourseModule } from 'src/api/purchased-course/purchased-course.module';

@Module({
  imports: [
    UserModule,
    CourseModule,
    forwardRef(() => PurchasedCourseModule), // 👈 MUHIM
  ],
  providers: [BotService, BotUpdate, TelegramFileService],
  exports: [BotService], // 👈 Export qilish MUHIM
})
export class BotModule {}
