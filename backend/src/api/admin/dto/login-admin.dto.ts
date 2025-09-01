// src/modules/admin/dto/login-admin.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginAdminDto {
    @ApiProperty({
        description: "Adminning ro‘yxatdan o‘tgan email manzili.",
        example: "admin@example.com",
        format: "email",
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Adminning paroli.",
        example: "StrongPassword123",
    })
    @IsString()
    password: string;
}
