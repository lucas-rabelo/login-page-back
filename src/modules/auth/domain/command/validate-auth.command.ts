import { ICommand } from "@nestjs/cqrs";
import type { ValidateAuthDto } from "../dto/validate-auth.dto";

export class ValidateAuthCommand implements ICommand {
  constructor(public readonly validateAuthDto: ValidateAuthDto) { }
}