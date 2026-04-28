import { ICommand } from "@nestjs/cqrs";
import { RegisterAuthDto } from "../dto/register-auth.dto";

export class RegisterAuthCommand implements ICommand {
  constructor(public readonly registerAuthDto: RegisterAuthDto) { }
}