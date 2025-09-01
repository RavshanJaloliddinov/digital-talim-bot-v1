import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    example: 'JavaScript for Beginners',
    description: 'Kursning sarlavhasi',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Ushbu kurs JavaScript asoslarini o‘rgatadi.',
    description: 'Kurs haqida batafsil maʼlumot',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 199000,
    description: 'Kurs narxi (so‘mda)',
    type: Number,
  })
  @IsNumber()
  price: number;
}
