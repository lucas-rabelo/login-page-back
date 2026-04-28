import { IsJWT } from "class-validator";

export class ValidateAuthDto {
  @IsJWT()
  token: string;
}