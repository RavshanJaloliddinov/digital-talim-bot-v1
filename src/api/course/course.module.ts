import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseEntity } from 'src/core/course.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CourseEntity])],
    providers: [CourseService],
    controllers: [CourseController],
    exports: [CourseService],
})
export class CourseModule {}
