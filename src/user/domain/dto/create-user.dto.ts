import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword, ValidateIf } from "class-validator";
import { Role } from "../../../core/enums/role.enum";

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

    @ValidateIf((o) => !o.googleSub)
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string;
    
    @ValidateIf((o) => !o.googleSub && o.password)
    @IsString()
    confirmPassword: string;

    @IsOptional()
    @IsString()
    googleSub: string;
}