import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";

import type { CreateUserDto } from "../../user/domain/dto/create-user.dto";
import { LoginAuthDto } from "../domain/dto/login-auth.dto";

import type { UserService } from "../../user/services/user.service";
import type { EmailService } from "../../email/services/email.service";
import type { TokenService } from "../../shared/token/services/token.service";
import type { HashService } from "../../shared/hash/services/hash.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly hashService: HashService
    ) { }

    async login(data: LoginAuthDto) {
        const user = await this.userService.getUserByEmail(data.email);

        if (!user) {
            throw new UnauthorizedException('Usuário e/ou senha incorretas!');
        }

        if (!await this.hashService.compare(data.password, user.password)) {
            throw new UnauthorizedException('Usuário e/ou senha incorretas!');
        }

        return this.tokenService.createToken(user);
    }

    async resetPassword(password: string, token: string) {
        const user = this.tokenService.checkToken<User>(token, {
            issuer: 'forget',
            audience: 'users'
        });

        if (!user.uuid) {
            throw new BadRequestException("Token inválido.")
        }

        return this.userService.patchUser(user.uuid, { password });
    }

    async register(data: CreateUserDto) {
        const userExist = await this.userService.getUserByEmail(data.email);

        if (userExist) {
            throw new ConflictException("Esse e-mail já está em uso.");
        } else {
            const user = await this.userService.postUser(data);

            return this.tokenService.createToken(user);
        }
    }

    async forget(email: string) {
        const user = await this.userService.getUserByEmail(email);

        if (!user) throw new NotFoundException('E-mail não encontrado.');

        const token = this.tokenService.createToken(user, {
            expiresIn: '30 minutes',
            subject: user.uuid,
            issuer: 'forget',
            audience: 'users'
        });

        const response = await this.emailService.sendEmail({
            token: token.access_token,
            user,
            subject: 'Reset my password!',
            template: 'reset-password'
        });

        if (response) {
            return true;
        } else {
            return false;
        }
    }
}