import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "../controllers/auth.controller";

import { CqrsModule } from "@nestjs/cqrs";
import { HashService } from "../../../shared/hash/services/hash.service";
import { AuthService } from "../services/auth.service";
import { GoogleStrategy } from "../strategies/google.strategy";

import { EmailModule } from "../../../shared/email/modules/email.module";
import { HashModule } from "../../../shared/hash/modules/hash.module";
import { PrismaModule } from "../../../infra/prisma/modules/prisma.module";
import { StorageModule } from "../../../shared/storage/modules/storage.module";
import { TokenModule } from "../../../shared/token/modules/token.module";
import { UserModule } from "../../user/modules/user.module";
import { VerifyUserGoogleHandler } from "../domain/command/verify-user-google.handle";

export const CommandHandlers = [VerifyUserGoogleHandler];
@Module({
    imports: [
        CqrsModule,
        PassportModule.register({ defaultStrategy: 'google' }),
        PrismaModule,
        StorageModule,
        TokenModule,
        EmailModule,
        HashModule,
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, HashService, GoogleStrategy, ...CommandHandlers],
    exports: [AuthService, HashService]
})
export class AuthModule {

}