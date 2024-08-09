import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { UpdatePutUserCommand } from "./update-put-user.command";

import { UserService } from "src/user/services/user.service";
import { ReadUserDto } from "../dto/read-user.dto";
import { BadRequestException } from "@nestjs/common";

@CommandHandler(UpdatePutUserCommand)
export class UpdatePutUserHandler implements ICommandHandler<UpdatePutUserCommand> {
    constructor(
        public readonly userService: UserService
    ) {}

    async execute(command: UpdatePutUserCommand): Promise<ReadUserDto> {
        const { uuid, updateUserDto } = command;

        const user = await this.userService.updateUser(uuid, updateUserDto);

        if(!user) {
            throw new BadRequestException("There was a problem updating the user");
        }

        return <ReadUserDto> {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role,
            googleSub: user.googleSub,
            birthDate: user.birthDate,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    } 
}