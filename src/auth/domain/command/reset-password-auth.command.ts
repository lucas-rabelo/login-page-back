import { ICommand } from "@nestjs/cqrs";
import type { ResetAuthDto } from "../dto/reset-auth.dto";

export class ResetPasswordAuthCommand implements ICommand {
  constructor(public readonly resetAuthDto: ResetAuthDto) {}
}