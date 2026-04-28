import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

import { LoginAuthDto } from "../domain/dto/login-auth.dto";

import type { EmailService } from "../../email/services/email.service";
import type { HashService } from "../../shared/hash/services/hash.service";
import type { CreateTokenDto } from "../../shared/token/domain/dto/create-token.dto";
import type { TokenService } from "../../shared/token/services/token.service";
import type { UserService } from "../../user/services/user.service";
import type { RegisterAuthDto } from "../domain/dto/register-auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly hashService: HashService
    ) { }

    async login(data: LoginAuthDto): Promise<CreateTokenDto | null> {
        const user = await this.userService.getUserByEmail(data.email);

        if (!user) return null;

        const passwordMatch = await this.hashService.compare(data.password, user.password);
        if (!passwordMatch) return null;

        return this.tokenService.createToken(user);
    }

    async resetPassword(password: string, token: string) {
        const user = this.tokenService.checkToken<User>(token, {
            issuer: 'forget',
            audience: 'users'
        });

        if (!user.uuid) return null;

        return this.userService.patchUser(user.uuid, { password });
    }

    async register(data: RegisterAuthDto): Promise<CreateTokenDto | null> {
        const user = await this.userService.postUser(data);

        if (!user) return null;

        return this.tokenService.createToken(user);
    }

    async checkEmailAvailability(email: string) {
        const userExist = await this.userService.getUserByEmail(email);

        return !!userExist;
    };

    async forget(email: string): Promise<boolean | null> {
        const user = await this.userService.getUserByEmail(email);

        if (!user) return null;

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

        return !!response;
    }
}