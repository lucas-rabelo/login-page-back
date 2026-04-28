import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import type { CreateTokenDto } from "../../../shared/token/domain/dto/create-token.dto";
import { AuthService } from "../../services/auth.service";
import { LoginAuthCommand } from "./login-auth.command";

@CommandHandler(LoginAuthCommand)
export class LoginAuthHandler implements ICommandHandler<LoginAuthCommand> {
  constructor(private readonly authService: AuthService) { }

  async execute(command: LoginAuthCommand): Promise<CreateTokenDto | null> {
    const { loginAuthDto } = command;

    const token = await this.authService.login(loginAuthDto);

    if (!token) throw new UnauthorizedException('Usuário e/ou senha incorretas!');

    return token;
  }
}