import { ICommand } from "@nestjs/cqrs";
import { LoginAuthDto } from "../dto/login-auth.dto";

export class LoginAuthCommand implements ICommand {
  constructor(public readonly loginAuthDto: LoginAuthDto) {}
}