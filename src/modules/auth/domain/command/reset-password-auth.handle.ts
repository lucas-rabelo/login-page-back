import { BadRequestException } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { AuthService } from "../../services/auth.service";
import { ResetPasswordAuthCommand } from "./reset-password-auth.command";

@CommandHandler(ResetPasswordAuthCommand)
export class ResetPasswordAuthHandler implements ICommandHandler<ResetPasswordAuthCommand> {
  constructor(private readonly authService: AuthService) { }

  async execute(command: ResetPasswordAuthCommand): Promise<boolean | null> {
    const { password, confirmPassword, token } = command.resetAuthDto;

    const passwordAndConfirmPasswordIsNotEqual = password !== confirmPassword;

    if(passwordAndConfirmPasswordIsNotEqual) throw new BadRequestException("As senhas não conferem");

    const user = await this.authService.resetPassword(password, token);

    if (!user) throw new BadRequestException("Token inválido.")

    return !!user;
  }
}