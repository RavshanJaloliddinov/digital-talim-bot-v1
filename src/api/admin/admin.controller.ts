// src/modules/admin/admin.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Public } from "src/common/decorator/public";

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Public()
    @Post('register')
    register(@Body() dto: CreateAdminDto) {
        console.log(dto)
        return this.adminService.create(dto);
    }

    @Public()
    @Post('login')
    login(@Body() dto: LoginAdminDto) {
        return this.adminService.login(dto.email, dto.password);
    }

    @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    @Public()
    @Get()
    findAll() {
        return this.adminService.findAll();
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.adminService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateAdminDto>) {
        return this.adminService.update(id, dto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.adminService.remove(id);
    }
}
