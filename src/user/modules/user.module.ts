import { forwardRef, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { PrismaModule } from "src/prisma/modules/prisma.module";
import { AuthModule } from "src/auth/modules/auth.module";

import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";

import { CreateUserHandler } from "../domain/commands/create-user.handle";
import { UpdatePutUserHandler } from "../domain/commands/update-put-user.handle";
import { UpdatePatchUserHandler } from "../domain/commands/update-patch-user.handle";
import { DeleteUserHandler } from "../domain/commands/delete-user.handle";

import { ListUserHandler } from "../domain/queries/list-user.handle";
import { FindByUuidUserHandler } from "../domain/queries/findByUuid-user.handle";

export const CommandHandlers = [
    CreateUserHandler,
    UpdatePutUserHandler,
    UpdatePatchUserHandler,
    DeleteUserHandler
];

export const QueryHandlers = [
    ListUserHandler,
    FindByUuidUserHandler
];

@Module({
    imports: [
        PrismaModule,
        CqrsModule,
        forwardRef(() => AuthModule)
    ],
    controllers: [UserController],
    providers: [UserService, ...CommandHandlers, ...QueryHandlers],
    exports: [UserService]
})
export class UserModule {}