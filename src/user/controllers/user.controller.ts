import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import {
    CommandBus,
    QueryBus
} from '@nestjs/cqrs';

import { CreateUserDto } from "../domain/dto/create-user.dto";
import type { ListUserResponseDto, ListUserRequestDto } from "../domain/dto/list-user.dto";
import { ReadUserDto } from "../domain/dto/read-user.dto";
import { UpdatePatchUserDto } from "../domain/dto/update-patch-user.dto";
import { UpdatePutUserDto } from "../domain/dto/update-put-user.dto";

import { CreateUserCommand } from "../domain/commands/create-user.command";
import { DeleteUserCommand } from "../domain/commands/delete-user.command";
import { UpdatePatchUserCommand } from "../domain/commands/update-patch-user.command";
import { UpdatePutUserCommand } from "../domain/commands/update-put-user.command";

import { Roles } from "../../core/decorators/role.decorator";
import { Role } from "../../core/enums/role.enum";
import { AuthGuard } from "../../core/guards/auth.guard";
import { RoleGuard } from "../../core/guards/role.guard";
import { FindByUuidUserQuery } from "../domain/queries/findByUuid-user.query";
import { ListUserQuery } from "../domain/queries/list-user.query";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller({ path: 'users', version: '1' })
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @HttpCode(201)
    async create(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
        return await this.commandBus.execute(
            new CreateUserCommand(createUserDto)
        );
    }

    @Get()
    @HttpCode(200)
    async list(
        @Query() { page, itemsPerPage, search }: ListUserRequestDto,
    ): Promise<ListUserResponseDto> {
        return await this.queryBus.execute<ListUserQuery, ListUserResponseDto>(
            new ListUserQuery(page, itemsPerPage, search)
        )
    }

    @Get(':uuid')
    @HttpCode(200)
    async getUser(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<ReadUserDto> {
        return await this.queryBus.execute<FindByUuidUserQuery, ReadUserDto>(
            new FindByUuidUserQuery(uuid)
        )
    }

    @Put(':uuid')
    @HttpCode(204)
    async editUser(
        @Param('uuid', ParseUUIDPipe) uuid: string,
        @Body() updatePutUserDto: UpdatePutUserDto
    ): Promise<ReadUserDto> {
        return await this.commandBus.execute(
            new UpdatePutUserCommand(uuid, updatePutUserDto)
        )
    }

    @Patch(':uuid')
    @HttpCode(204)
    async editPartialUser(
        @Param('uuid', ParseUUIDPipe) uuid: string,
        @Body() updatePatchUserDto: UpdatePatchUserDto,
    ): Promise<ReadUserDto> {
        return await this.commandBus.execute(
            new UpdatePatchUserCommand(uuid, updatePatchUserDto)
        )
    }

    @Delete(':uuid')
    @HttpCode(204)
    async delete(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<ReadUserDto> {
        return await this.commandBus.execute(
            new DeleteUserCommand(uuid)
        )
    }
}