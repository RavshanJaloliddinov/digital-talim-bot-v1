import { BaseEntity } from 'src/common/database/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { PurchasedCourseEntity } from './purchased-course.entity';

@Entity()
export class CourseEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @OneToMany(() => PurchasedCourseEntity, purchased => purchased.course)
  purchasedCourses: PurchasedCourseEntity[];
}
