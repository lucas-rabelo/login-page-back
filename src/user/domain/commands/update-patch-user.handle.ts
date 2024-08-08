import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "@nestjs/common";

import { UpdatePatchUserCommand } from "./update-patch-user.command";

import { UserService } from "src/user/services/user.service";
import { ReadUserDto } from "../dto/read-user.dto";

@CommandHandler(UpdatePatchUserCommand)
export class UpdatePatchUserHandler implements ICommandHandler<UpdatePatchUserCommand> {
    constructor(
        public readonly userService: UserService
    ) {}

    async execute(command: UpdatePatchUserCommand): Promise<ReadUserDto> {
        const { uuid, updateUserDto } = command;

        const user = await this.userService.patchUser(uuid, updateUserDto);

        if(!user) {
            throw new BadRequestException("There was a problem updating the user");
        }

        return <ReadUserDto> {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role,
            birthDate: user.birthDate,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    } 
}