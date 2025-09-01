import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserStatus } from 'src/core/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: '123456789', description: 'Telegram ID (unique)' })
  @IsString()
  telegramId: string;

  @ApiProperty({ example: 'Ali', description: 'User name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'ali_dev', description: 'Telegram username' })
  @IsString()
  username: string;

  @ApiProperty({ enum: UserStatus, default: UserStatus.CUSTOMER })
  @IsEnum(UserStatus)
  status: UserStatus;
}
