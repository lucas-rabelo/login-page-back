import { ICommand } from "@nestjs/cqrs";
import type { LoginGoogleAuthDto } from "../dto/login-google-auth.dto";

export class VerifyUserGoogleCommand implements ICommand {
    constructor(public readonly loginGoogleAuthDto: LoginGoogleAuthDto) { }
}