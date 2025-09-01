// src/modules/admin/admin.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { AdminEntity } from "src/core/admin.entity";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private readonly adminRepo: Repository<AdminEntity>,
        private readonly jwtService: JwtService
    ) { }

    async create(dto: CreateAdminDto) {
        const existingAdmin = await this.adminRepo.findOne({ where: { email: dto.email } });
        if (existingAdmin) {
            throw new BadRequestException('An admin with this email already exists!');
        }
        const password = await bcrypt.hash(dto.password, 10);
        const admin = this.adminRepo.create({ ...dto, password });
        return this.adminRepo.save(admin);
    }

    async login(email: string, password: string) {
        const admin = await this.adminRepo.findOne({ where: { email } });
        if (!admin) throw new UnauthorizedException("Email not found");

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) throw new UnauthorizedException("Incorrect password");

        const token = this.jwtService.sign({ sub: admin.id, email: admin.email });
        return {
            message: "success 200",
            access_token: token
        };
    }

    async findAll() {
        return this.adminRepo.find();
    }

    async findOne(id: string) {
        return this.adminRepo.findOne({ where: { id } });
    }

    async update(id: string, dto: Partial<CreateAdminDto>) {
        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 10);
        }
        await this.adminRepo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.adminRepo.delete(id);
        return { message: "Deleted successfully" };
    }
}
