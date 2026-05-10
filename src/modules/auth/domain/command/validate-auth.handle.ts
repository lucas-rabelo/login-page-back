import { BadRequestException } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { ValidateAuthCommand } from "./validate-auth.command";
import { TokenService } from "../../../../shared/token/services/token.service";

@CommandHandler(ValidateAuthCommand)
export class ValidateAuthHandler implements ICommandHandler<ValidateAuthCommand> {
  constructor(private readonly tokenService: TokenService) { }

  async execute(command: ValidateAuthCommand): Promise<boolean | null> {
    const { token } = command.validateAuthDto;

    const user = this.tokenService.validateToken(token);

    if (!user) throw new BadRequestException("Token inválido.")

    return user;
  }
}