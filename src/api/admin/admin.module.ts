// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 🔥 bu qatorni qo‘shing
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { AdminEntity } from 'src/core/admin.entity';
import { config } from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    JwtModule.register({
      secret: config.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: config.ACCESS_TOKEN_EXPIRED_TIME },
    }),
    ConfigModule, // ✅ bu qator muammoni hal qiladi
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
})
export class AdminModule {}
