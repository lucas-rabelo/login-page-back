import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "../controllers/auth.controller";

import { CqrsModule } from "@nestjs/cqrs";
import { AuthService } from "../services/auth.service";
import { GoogleStrategy } from "../strategies/google.strategy";

import { EmailModule } from "../../../shared/email/modules/email.module";
import { PrismaModule } from "../../../infra/prisma/modules/prisma.module";
import { HashModule } from "../../../shared/hash/modules/hash.module";
import { TokenModule } from "../../../shared/token/modules/token.module";
import { UserModule } from "../../user/modules/user.module";

import { VerifyUserGoogleHandler } from "../domain/command/verify-user-google.handle";
import { ForgetAuthHandler } from '../domain/command/forget-auth.handle';
import { LoginAuthHandler } from '../domain/command/login-auth.handle';
import { RegisterAuthHandler } from '../domain/command/register-auth.handle';
import { ResetPasswordAuthHandler } from '../domain/command/reset-password-auth.handle';
import { ValidateAuthHandler } from '../domain/command/validate-auth.handle';

export const CommandHandlers = [
    VerifyUserGoogleHandler,
    ForgetAuthHandler,
    LoginAuthHandler,
    RegisterAuthHandler,
    ResetPasswordAuthHandler,
    ValidateAuthHandler,
];

@Module({
    imports: [
        CqrsModule,
        HashModule,
        PassportModule.register({ defaultStrategy: 'google' }),
        PrismaModule,
        TokenModule,
        EmailModule,
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, ...CommandHandlers],
    exports: [AuthService]
})
export class AuthModule {

}