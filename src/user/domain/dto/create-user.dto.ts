import { IsDateString, IsEmail, IsEnum, IsString, IsStrongPassword } from "class-validator";
import { Role } from "src/core/enums/role.enum";

export class CreateUserDto {
    @IsString()
    name: string;
    
    @IsEmail()
    email: string;

    @IsDateString()
    birthDate: string;

    @IsEnum(Role)
    role: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string;
}