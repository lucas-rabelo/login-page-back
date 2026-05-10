import { IsEmail } from "class-validator";

export class ForgetAuthDto {
    @IsEmail()
    email: string;
}