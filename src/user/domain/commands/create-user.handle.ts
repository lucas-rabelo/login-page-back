import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { CreateUserCommand } from "./create-user.command";
import { UserService } from "src/user/services/user.service";
import { ReadUserDto } from "../dto/read-user.dto";
import { BadRequestException } from "@nestjs/common";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {

    constructor(private readonly userService: UserService) {}

    async execute(command: CreateUserCommand): Promise<ReadUserDto> {
        const { createUserDto } = command;

        const newUser = await this.userService.postUser(createUserDto);

        if(!newUser) {
            throw new BadRequestException("There was a problem creating the user");
        }

        return <ReadUserDto>{
            uuid: newUser.uuid,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            googleSub: newUser.googleSub,
            birthDate: newUser.birthDate,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        };
    }
}