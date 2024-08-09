import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { FindByUuidUserQuery } from "./findByUuid-user.query";

import { UserService } from "src/user/services/user.service";

import { ReadUserDto } from "../dto/read-user.dto";
import { BadRequestException } from "@nestjs/common";

@QueryHandler(FindByUuidUserQuery)
export class FindByUuidUserHandler implements IQueryHandler<FindByUuidUserQuery> {
    constructor(private readonly userService: UserService) {}

    async execute(query: FindByUuidUserQuery): Promise<ReadUserDto> {
        const { uuid } = query;

        const user = await this.userService.getUserByUuid(uuid);

        if(!user) {
            throw new BadRequestException('User Not Found');
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