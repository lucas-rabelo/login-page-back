import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { Role } from "src/core/enums/role.enum";

export class CreateUserDto {
    @IsString()
    name: string;
    
    @IsEmail()
    email: string;

    @IsOptional()
    @IsDateString()
    birthDate: string;

    @IsEnum(Role)
    role: string;

    @IsOptional()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string;

    @IsOptional()
    @IsString()
    googleSub: string;
}