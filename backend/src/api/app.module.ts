import { Module } from '@nestjs/common';
import { BotModule } from '../bot/bot.module';
import { AdminModule } from './admin/admin.module';
import { CourseModule } from './course/course.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminEntity } from 'src/core/admin.entity';
import { UserEntity } from 'src/core/user.entity';
import { UserModule } from './user/user.module';
import { CourseEntity } from 'src/core/course.entity';
import { PurchasedCourseModule } from './purchased-course/purchased-course.module';
import { PurchasedCourseEntity } from 'src/core/purchased-course.entity';
import { Telegraf } from 'telegraf';
import { TelegramFileService } from 'src/infrastructure/telegram_file';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URL,
      synchronize: true,
      entities: [AdminEntity, UserEntity, CourseEntity, PurchasedCourseEntity],
      ssl: false
    }),
    BotModule,
    CourseModule,
    AdminModule,
    UserModule,
    PurchasedCourseModule
  ],
  providers: [
    // {
    //   provide: Telegraf,
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const bot = new Telegraf(config.BOT_TOKEN);
    //     return bot;
    //   },
    // },
    TelegramFileService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [TelegramFileService]
})
export class AppModule { }
