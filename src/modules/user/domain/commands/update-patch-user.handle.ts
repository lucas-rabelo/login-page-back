import { BadRequestException, ConflictException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { UpdatePatchUserCommand } from "./update-patch-user.command";

import { UserService } from "../../services/user.service";
import { ReadUserDto } from "../dto/read-user.dto";

@CommandHandler(UpdatePatchUserCommand)
export class UpdatePatchUserHandler implements ICommandHandler<UpdatePatchUserCommand> {
    constructor(
        public readonly userService: UserService
    ) { }

    async execute(command: UpdatePatchUserCommand): Promise<ReadUserDto> {
        const { uuid, updateUserDto } = command;
        const { email, password, confirmPassword } = updateUserDto;

        const emailInUse = await this.userService.getUserByEmail(email);
    
        if (emailInUse) throw new ConflictException("Esse e-mail já está em uso.");
    
        const passwordAndConfirmPasswordIsNotEqual = password !== confirmPassword;
    
        if(passwordAndConfirmPasswordIsNotEqual) throw new BadRequestException("As senhas não conferem");

        const user = await this.userService.patchUser(uuid, updateUserDto);

        if (!user) {
            throw new BadRequestException("There was a problem updating the user");
        }

        return <ReadUserDto>{
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