import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CourseEntity } from './course.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity('purchesed_course')
export class PurchasedCourseEntity extends BaseEntity {

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @Column({ name: 'check_image' })
  checkImage: string;

  @Column({ default: 'unverified' })
  status: 'verified' | 'unverified' | 'pending';
}
  