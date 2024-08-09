import { ICommand } from "@nestjs/cqrs";
import { LoginGoogleAuthDto } from "src/auth/domain/dto/login-google-auth.dto";

export class VerifyUserGoogleCommand implements ICommand {
    constructor(public readonly loginGoogleAuthDto: LoginGoogleAuthDto) {}
}