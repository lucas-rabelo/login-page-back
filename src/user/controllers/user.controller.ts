import { 
    Get, 
    Put, 
    Body, 
    Post, 
    Query,
    Param, 
    Patch, 
    Delete, 
    UseGuards,
    Controller, 
    ParseUUIDPipe,
    ParseIntPipe,
} from "@nestjs/common";
import { 
    QueryBus,
    CommandBus 
} from '@nestjs/cqrs';

import { CreateUserDto } from "../domain/dto/create-user.dto";
import { UpdatePutUserDto } from "../domain/dto/update-put-user.dto";
import { UpdatePatchUserDto } from "../domain/dto/update-patch-user.dto";
import { ReadUserDto } from "../domain/dto/read-user.dto";
import { ListUserDto } from "../domain/dto/list-user.dto";

import { Roles } from "src/core/decorators/role.decorator";

import { Role } from "src/core/enums/role.enum";

import { RoleGuard } from "src/core/guards/role.guard";
import { AuthGuard } from "src/core/guards/auth.guard";

import { CreateUserCommand } from "../domain/commands/create-user.command";
import { UpdatePutUserCommand } from "../domain/commands/update-put-user.command";
import { UpdatePatchUserCommand } from "../domain/commands/update-patch-user.command";
import { DeleteUserCommand } from "../domain/commands/delete-user.command";

import { ListUserQuery } from "../domain/queries/list-user.query";
import { FindByUuidUserQuery } from "../domain/queries/findByUuid-user.query";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
        return await this.commandBus.execute(
            new CreateUserCommand(createUserDto)
        );
    }

    @Get()
    async list(
        @Query('page', ParseIntPipe) page: number,
        @Query('itemsPerPage', ParseIntPipe) itemsPerPage: number,
        @Query('search') search?: string
    ): Promise<ListUserDto> {
        return await this.queryBus.execute<ListUserQuery, ListUserDto>(
            new ListUserQuery(page, itemsPerPage, search)
        )
    }

    @Get(':uuid')
    async getUser(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<ReadUserDto> {
        return await this.queryBus.execute<FindByUuidUserQuery, ReadUserDto>(
            new FindByUuidUserQuery(uuid)
        )
    }

    @Put(':uuid')
    async editUser(
        @Param('uuid', ParseUUIDPipe) uuid: string,
        @Body() updatePutUserDto: UpdatePutUserDto
    ): Promise<ReadUserDto> {
        return await this.commandBus.execute(
            new UpdatePutUserCommand(uuid, updatePutUserDto)
        )
    }

    @Patch(':uuid')
    async editPartialUser(
        @Param('uuid', ParseUUIDPipe) uuid: string,
        @Body() updatePatchUserDto: UpdatePatchUserDto, 
    ): Promise<ReadUserDto> {
        return await this.commandBus.execute(
            new UpdatePatchUserCommand(uuid, updatePatchUserDto)
        )
    }

    @Delete(':uuid')
    async delete(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<ReadUserDto> {
        return await this.commandBus.execute(
            new DeleteUserCommand(uuid)
        )
    }
}