import { ICommand } from "@nestjs/cqrs";
import { UpdatePutUserDto } from "../dto/update-put-user.dto";

export class UpdatePutUserCommand implements ICommand {
    constructor(
        public readonly uuid: string,
        public readonly updateUserDto: UpdatePutUserDto
    ) {}
}