import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { PrismaModule } from "src/prisma/modules/prisma.module";
import { UserModule } from "src/user/modules/user.module";
import { StorageModule } from "src/storage/modules/storage.module";

import { AuthController } from "../controllers/auth.controller";

import { AuthService } from "../services/auth.service";
import { GoogleStrategy } from "../strategies/google.strategy";
import { CqrsModule } from "@nestjs/cqrs";

import { VerifyUserGoogleHandler } from "../domain/command/verify-user-google.handle";

export const CommandHandlers = [ VerifyUserGoogleHandler ];
@Module({
    imports: [
        CqrsModule,
        PassportModule.register({ defaultStrategy: 'google' }),
        JwtModule.register({
            secret: `${process.env.SECRET_ENV}`
        }),
        PrismaModule,
        StorageModule,
        forwardRef(() => UserModule)
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, ...CommandHandlers],
    exports: [AuthService]
})
export class AuthModule {

}