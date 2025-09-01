import { Controller, Post, Get, Param, Body, Delete, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { PurchasedCourseService } from './purchased-course.service';
import { CreatePurchasedCourseDto } from './dto/create-purchased-course.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentStatus } from 'src/common/database/Enum';
import { PurchasedCourseEntity } from 'src/core/purchased-course.entity';
import { setFlagsFromString } from 'v8';

@ApiTags('Purchased Courses')
@Controller('purchased-courses')
@Public()
export class PurchasedCourseController {
  constructor(private readonly service: PurchasedCourseService) { }

  @Post()
  @ApiOperation({ summary: 'Purchase a course with optional check image file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', format: 'uuid' },
        courseId: { type: 'string', format: 'uuid' },
        checkImage: { type: 'string', format: 'binary' },
        status: { type: 'string', enum: ['verified', 'unverified', 'pending'] },
      },
      required: ['userId', 'courseId', 'status'],
    },
  })
  @UseInterceptors(FileInterceptor('checkImage'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreatePurchasedCourseDto,
  ) {
    return this.service.create(body, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all purchased courses' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':status')
  @ApiOperation({ summary: 'Get payments with status' })
  findWithStatus(@Param('status') status: PaymentStatus) {
    return this.service.findWithStatus(status);
  }

  @Get('/one/:id')
  @ApiOperation({ summary: 'Get purchased course by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a purchased course' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update payment status of a purchased course' })
  @ApiParam({ name: 'id', description: 'ID of the purchased course' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(PaymentStatus),
          example: PaymentStatus.VERIFIED,
          description: 'New payment status',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully',
    type: PurchasedCourseEntity, // Make sure to import your entity
  })
  @ApiResponse({
    status: 404,
    description: 'Purchased course not found',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: PaymentStatus },
  ) {
    return this.service.updateStatus(id, body.status);
  }

}
