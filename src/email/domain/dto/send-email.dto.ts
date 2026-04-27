import type { User } from "@prisma/client";
import { IsObject, IsString } from "class-validator";

export class SendEmailDto {
  @IsString()
  subject: string;

  @IsString()
  template: string;

  @IsString()
  token: string;

  @IsObject()
  user: User;
}