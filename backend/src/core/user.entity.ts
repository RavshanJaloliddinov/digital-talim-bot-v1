import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity } from "typeorm";

export enum UserStatus {
  CUSTOMER = 'customer',
  NON_CUSTOMER = 'non-customer',
}

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ name: 'telegram_id', unique: true })
  telegramId: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.CUSTOMER, 
  })
  status: UserStatus;
}
