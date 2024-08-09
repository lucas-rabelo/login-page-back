import { IsDate, IsDateString, IsEmail, IsEnum, IsString } from "class-validator";
import { Role } from "src/core/enums/role.enum";

export class ReadUserDto {
    @IsString()
    uuid: string;

    @IsString()
    name: string;
    
    @IsEmail()
    email: string;
    
    @IsEnum(Role)
    role: string;

    @IsDateString()
    birthDate: string;

    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;

    @IsString()
    googleSub: string;
}