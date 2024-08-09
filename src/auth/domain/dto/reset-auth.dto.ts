import { IsJWT, IsStrongPassword } from "class-validator";

export class ResetAuthDto {
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string;

    @IsJWT()
    token: string;
}