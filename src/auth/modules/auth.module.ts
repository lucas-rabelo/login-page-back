import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "../controllers/auth.controller";

import { CqrsModule } from "@nestjs/cqrs";
import { AuthService } from "../services/auth.service";
import { HashService } from "../services/hash.service";
import { TokenService } from "../services/token.service";
import { GoogleStrategy } from "../strategies/google.strategy";

import { EmailModule } from "../../email/modules/email.module";
import { PrismaModule } from "../../prisma/modules/prisma.module";
import { StorageModule } from "../../storage/modules/storage.module";
import { UserModule } from "../../user/modules/user.module";
import { VerifyUserGoogleHandler } from "../domain/command/verify-user-google.handle";

export const CommandHandlers = [VerifyUserGoogleHandler];
@Module({
    imports: [
        CqrsModule,
        PassportModule.register({ defaultStrategy: 'google' }),
        JwtModule.register({
            secret: `${process.env.SECRET_ENV}`
        }),
        PrismaModule,
        StorageModule,
        EmailModule,
        forwardRef(() => UserModule)
    ],
    controllers: [AuthController],
    providers: [AuthService, TokenService, HashService, GoogleStrategy, ...CommandHandlers],
    exports: [AuthService, TokenService, HashService]
})
export class AuthModule {

}