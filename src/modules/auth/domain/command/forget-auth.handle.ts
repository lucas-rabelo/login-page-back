import { BadRequestException } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { AuthService } from "../../services/auth.service";
import { ForgetAuthCommand } from "./forget-auth.command";

@CommandHandler(ForgetAuthCommand)
export class ForgetAuthHandler implements ICommandHandler<ForgetAuthCommand> {
  constructor(private readonly authService: AuthService) { }

  async execute(command: ForgetAuthCommand): Promise<boolean | null> {
    const { email } = command.forgetAuthDto;

    const response = await this.authService.forget(email);

    if (!response) throw new BadRequestException('Problemas ao e-mail de reset de senha');

    return response;
  }
}