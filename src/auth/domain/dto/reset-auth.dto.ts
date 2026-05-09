import { IsJWT, IsString, IsStrongPassword, ValidateIf } from "class-validator";

export class ResetAuthDto {
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string;

    @ValidateIf((o) => o.password)
    @IsString()
    confirmPassword: string;

    @IsJWT()
    token: string;
}