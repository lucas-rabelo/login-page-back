import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { PrismaService } from "src/prisma/services/prisma.service";
import { UserService } from "src/user/services/user.service";
import { MailerService } from "@nestjs-modules/mailer";

import { CreateUserDto } from "src/user/domain/dto/create-user.dto";
import { LoginAuthDto } from "../domain/dto/login-auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailerService: MailerService
    ) {}

    createToken(user: User) {
        const token = this.jwtService.sign({
            uuid: user.uuid,
            name: user.name,
            email: user.email
        }, {
            expiresIn: '7 days',
            subject: user.uuid,
        });

        return {
            access_token: token
        }
    }

    checkToken(token: string) {
        try {
            const data = this.jwtService.verify(token);

            return data;
        } catch(e) {
            throw new UnauthorizedException('Usuário não autorizado');
        }
    }

    validateToken(token: string) {
        const validated = this.checkToken(token);
        if(validated) {
            return true;
        } else {
            return false;
        }
    }

    async login(data: LoginAuthDto) {
        const user = await this.userService.getUserByEmail(data.email);

        if(!user) {
            throw new UnauthorizedException('Usuário e/ou senha incorretas!');
        } 
        
        if(!await bcrypt.compare(data.password, user.password)) {
            throw new UnauthorizedException('Usuário e/ou senha incorretas!');
        } 

        return this.createToken(user);
    }

    async resetPassword(password: string, token: string) {
        const user = this.jwtService.verify<User>(token, {
            issuer: 'forget',
            audience: 'users' 
        });

        if(!user.uuid) {
            throw new BadRequestException("Token inválido.")
        }

        return this.userService.patchUser(user.uuid, { password });
    }

    async register(data: CreateUserDto) {
        const userExist = await this.userService.getUserByEmail(data.email);
        
        if(userExist) {
            throw new ConflictException("Esse e-mail já está em uso.");
        } else {
            const user = await this.userService.postUser(data);
    
            return this.createToken(user);
        }
    }

    async forget(email: string) {
        const user = await this.userService.getUserByEmail(email);

        const token = this.jwtService.sign({
            uuid: user.uuid
        }, {
            expiresIn: '30 minutes',
            subject: user.uuid,
            issuer: 'forget',
            audience: 'users' 
        });

        const url = `${process.env.URL_FRONT}reset_password/${token}`;

        const response = await this.mailerService.sendMail({
            subject: 'Reset my password!',
            to: user.email,
            template: 'reset-password',
            context: {
                name: user.name,
                url
            },
        });

        if(response) {
            return true;
        } else {
            return false;
        }
    }
}