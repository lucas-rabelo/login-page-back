import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { ListUserQuery } from "./list-user.query";

import { UserService } from "../../services/user.service";
import { ListUserResponseDto } from "../dto/list-user.dto";
import { ReadUserDto } from "../dto/read-user.dto";

@QueryHandler(ListUserQuery)
export class ListUserHandler implements IQueryHandler<ListUserQuery> {
    constructor(private readonly userService: UserService) { }

    async execute(query: ListUserQuery): Promise<ListUserResponseDto> {
        const { page, itemsPerPage, search } = query;

        const [users, total] = await this.userService.listUser(
            page,
            itemsPerPage,
            search
        );

        return <ListUserResponseDto>{
            data: users.length
                ? users.map(
                    (user) =>
                        <ReadUserDto>{
                            uuid: user.uuid,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            googleSub: user.googleSub,
                            birthDate: user.birthDate,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt
                        }
                )
                : [],
            total: total,
        }
    }
}