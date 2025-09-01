import {
    Injectable,
    NotFoundException,
    BadRequestException,
    HttpStatus,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { CreateCourseDto } from './dto/create-course.dto';
  import { UpdateCourseDto } from './dto/update-course.dto';
  import { CourseEntity } from 'src/core/course.entity';
  
  @Injectable()
  export class CourseService {
    constructor(
      @InjectRepository(CourseEntity)
      private readonly courseRepository: Repository<CourseEntity>,
    ) {}
  
    async create(createCourseDto: CreateCourseDto) {
      const exists = await this.courseRepository.findOne({
        where: { title: createCourseDto.title },
      });
  
      if (exists) {
        throw new BadRequestException('A course with this title already exists.');
      }
  
      const course = await this.courseRepository.save(createCourseDto);
  
      return {
        message: 'Course created successfully.',
        status: HttpStatus.CREATED,
        data: course,
      };
    }
  
    async findAll() {
      const courses = await this.courseRepository.find({where: {is_deleted: false}});
  
      return {
        message: 'List of all courses.',
        status: HttpStatus.OK,
        data: courses,
      };
    }
  
    async findOne(id: string) {
      const course = await this.courseRepository.findOne({
        where: { id },
      });
  
      if (!course) {
        throw new NotFoundException('Course not found.');
      }
  
      return {
        message: 'Course retrieved successfully.',
        status: HttpStatus.OK,
        data: course,
      };
    }
  
    async update(id: string, updateCourseDto: UpdateCourseDto) {
      const existing = await this.findOne(id);
  
      const updated = await this.courseRepository.save({
        ...existing.data,
        ...updateCourseDto,
      });
  
      return {
        message: 'Course updated successfully.',
        status: HttpStatus.OK,
        data: updated,
      };
    }
  
    async remove(id: string) {
      const existing = await this.findOne(id);
  
      const removed = await this.courseRepository.remove(existing.data);
  
      return {
        message: 'Course deleted successfully.',
        status: HttpStatus.OK,
        data: removed,
      };
    }
  
    async findAllWithPurchases() {
      const courses = await this.courseRepository.find({
        relations: ['purchasedCourses', 'purchasedCourses.user'],
      });
  
      return {
        message: 'Courses with purchased users retrieved successfully.',
        status: HttpStatus.OK,
        data: courses,
      };
    }
  }
  