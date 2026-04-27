import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";

import { CreateUserHandler } from "../domain/commands/create-user.handle";
import { DeleteUserHandler } from "../domain/commands/delete-user.handle";
import { UpdatePatchUserHandler } from "../domain/commands/update-patch-user.handle";
import { UpdatePutUserHandler } from "../domain/commands/update-put-user.handle";

import { PrismaModule } from "../../prisma/modules/prisma.module";
import { HashModule } from "../../shared/hash/modules/hash.module";
import { FindByUuidUserHandler } from "../domain/queries/findByUuid-user.handle";
import { ListUserHandler } from "../domain/queries/list-user.handle";

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
        HashModule,
    ],
    controllers: [UserController],
    providers: [UserService, ...CommandHandlers, ...QueryHandlers],
    exports: [UserService]
})
export class UserModule { }