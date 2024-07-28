import { forwardRef, Module } from "@nestjs/common";

import { PrismaModule } from "src/prisma/modules/prisma.module";
import { AuthModule } from "src/auth/modules/auth.module";

import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";

@Module({
    imports: [
        PrismaModule,
        forwardRef(() => AuthModule)
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}