import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { PrismaModule } from "src/prisma/modules/prisma.module";

import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { UserModule } from "src/user/modules/user.module";
import { StorageModule } from "src/storage/modules/storage.module";

@Module({
    imports: [
        JwtModule.register({
            secret: `${process.env.SECRET_ENV}`
        }),
        PrismaModule,
        StorageModule,
        forwardRef(() => UserModule)
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {

}