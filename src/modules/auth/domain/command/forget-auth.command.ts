import { ICommand } from "@nestjs/cqrs";
import type { ForgetAuthDto } from "../dto/forget-auth.dto";

export class ForgetAuthCommand implements ICommand {
  constructor(public readonly forgetAuthDto: ForgetAuthDto) {}
}