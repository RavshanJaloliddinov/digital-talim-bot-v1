// src/modules/admin/dto/create-admin.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { Unique } from "typeorm";

export class CreateAdminDto {
    @ApiProperty({
        description: "Adminning email manzili. Unikal bo‘lishi kerak.",
        example: "admin@example.com",
        format: "email",
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak.",
        example: "StrongPassword123",
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: "Adminning to‘liq ismi.",
        example: "Ali Valiyev",
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
