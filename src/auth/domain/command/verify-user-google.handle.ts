import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "@nestjs/common";

import { VerifyUserGoogleCommand } from "./verify-user-google.command";

import { UserService } from "src/user/services/user.service";
import { AuthService } from "src/auth/services/auth.service";

@CommandHandler(VerifyUserGoogleCommand)
export class VerifyUserGoogleHandler implements ICommandHandler<VerifyUserGoogleCommand> {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    async execute(command: VerifyUserGoogleCommand) {
        const { loginGoogleAuthDto } = command;
        
        const userExist = await this.userService.getUserByEmailAndSub(loginGoogleAuthDto.email, loginGoogleAuthDto.sub);
        
        if(!userExist) {
            try {
                const newUser = await this.userService.postUser({
                    email: loginGoogleAuthDto.email,
                    name: loginGoogleAuthDto.name,
                    googleSub: loginGoogleAuthDto.sub,
                    role: 'user',
                    birthDate: null,
                    password: null
                });
            
                return this.authService.createToken(newUser);
            } catch (error) {
                throw new BadRequestException('Erro ao criar usuário: ' + error.message);
            }
        } else {
            return this.authService.createToken(userExist);
        }
    }
}