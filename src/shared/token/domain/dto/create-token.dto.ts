import { IsJWT } from "class-validator";

export class CreateTokenDto {
  @IsJWT()
  access_token: string;
}