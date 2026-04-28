import { BadRequestException, ConflictException } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import type { CreateTokenDto } from "../../../shared/token/domain/dto/create-token.dto";
import { AuthService } from "../../services/auth.service";
import { RegisterAuthCommand } from "./register-auth.command";

@CommandHandler(RegisterAuthCommand)
export class RegisterAuthHandler implements ICommandHandler<RegisterAuthCommand> {
  constructor(private readonly authService: AuthService) { }

  async execute(command: RegisterAuthCommand): Promise<CreateTokenDto | null> {
    const { registerAuthDto } = command;
    const { email } = registerAuthDto;

    const emailInUse = await this.authService.checkEmailAvailability(email);

    if (emailInUse) throw new ConflictException("Esse e-mail já está em uso.");

    const token = await this.authService.register(registerAuthDto);

    if (!token) throw new BadRequestException("Não foi possível criar o usuário.");

    return token;
  }
}