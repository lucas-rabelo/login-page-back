import { ICommand } from "@nestjs/cqrs";
import { UpdatePatchUserDto } from "../dto/update-patch-user.dto";

export class UpdatePatchUserCommand implements ICommand {
    constructor(
        public readonly uuid: string,
        public readonly updateUserDto: UpdatePatchUserDto
    ) {}
}