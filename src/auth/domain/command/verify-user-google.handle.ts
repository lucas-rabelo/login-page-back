import { BadRequestException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import type { UserService } from "../../../user/services/user.service";
import type { TokenService } from "../../services/token.service";
import { VerifyUserGoogleCommand } from "./verify-user-google.command";

@CommandHandler(VerifyUserGoogleCommand)
export class VerifyUserGoogleHandler implements ICommandHandler<VerifyUserGoogleCommand> {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService
    ) { }

    async execute(command: VerifyUserGoogleCommand) {
        const { loginGoogleAuthDto } = command;

        const userExist = await this.userService.getUserByEmailAndSub(loginGoogleAuthDto.email, loginGoogleAuthDto.sub);

        if (!userExist) {
            try {
                const newUser = await this.userService.postUser({
                    email: loginGoogleAuthDto.email,
                    name: loginGoogleAuthDto.name,
                    googleSub: loginGoogleAuthDto.sub,
                    role: 'user',
                    birthDate: null,
                    password: null
                });

                return this.tokenService.createToken(newUser);
            } catch (error) {
                throw new BadRequestException('Erro ao criar usuário: ' + error.message);
            }
        } else {
            return this.tokenService.createToken(userExist);
        }
    }
}