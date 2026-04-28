import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "../controllers/auth.controller";

import { CqrsModule } from "@nestjs/cqrs";
import { AuthService } from "../services/auth.service";
import { GoogleStrategy } from "../strategies/google.strategy";

import { EmailModule } from "../../email/modules/email.module";
import { PrismaModule } from "../../prisma/modules/prisma.module";
import { HashModule } from "../../shared/hash/modules/hash.module";
import { TokenModule } from "../../shared/token/modules/token.module";
import { UserModule } from "../../user/modules/user.module";
import { VerifyUserGoogleHandler } from "../domain/command/verify-user-google.handle";

export const CommandHandlers = [VerifyUserGoogleHandler];
@Module({
    imports: [
        CqrsModule,
        HashModule,
        PassportModule.register({ defaultStrategy: 'google' }),
        JwtModule.register({
            secret: `${process.env.SECRET_ENV}`
        }),
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