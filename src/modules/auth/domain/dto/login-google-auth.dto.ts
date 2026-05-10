import { IsEmail, IsString } from "class-validator";

export class LoginGoogleAuthDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    sub: string;
}