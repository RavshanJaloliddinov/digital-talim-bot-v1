import { IsUUID, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchasedCourseDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  courseId: string;

  @ApiProperty({ enum: ['verified', 'unverified', 'pending'], default: 'unverified' })
  @IsIn(['verified', 'unverified', 'pending'])
  status: 'verified' | 'unverified' | 'pending';
}
