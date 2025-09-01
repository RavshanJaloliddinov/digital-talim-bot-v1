import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'admins' })
export class AdminEntity extends BaseEntity {

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 50 })
    name: string;
} 