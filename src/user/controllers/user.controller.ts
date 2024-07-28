import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, UseGuards } from "@nestjs/common";

import { CreateUserDto } from "../dto/create-user.dto";
import { UpdatePutUserDto } from "../dto/update-put-user.dto";
import { UpdatePatchUserDto } from "../dto/update-patch-user.dto";

import { UserService } from "../services/user.service";

import { Roles } from "src/core/decorators/role.decorator";

import { Role } from "src/core/enums/role.enum";

import { RoleGuard } from "src/core/guards/role.guard";
import { AuthGuard } from "src/core/guards/auth.guard";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post()
    async create(@Body() data: CreateUserDto) {
        return this.userService.postUser(data);
    }

    @Roles(Role.Admin, Role.User)
    @Get()
    async list() {
        return this.userService.listUser()
    }

    @Get(':uuid')
    async getUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
        return this.userService.getUserByUuid(uuid);
    }

    @Put(':uuid')
    async editUser(@Body() data: UpdatePutUserDto, @Param('uuid', ParseUUIDPipe) uuid: string) {
        return this.userService.updateUser(uuid, data)
    }

    @Patch(':uuid')
    async editPartialUser(@Body() data: UpdatePatchUserDto, @Param('uuid', ParseUUIDPipe) uuid: string) {
        return this.userService.patchUser(uuid, data)
    }

    @Delete(':uuid')
    async delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
        return this.userService.deleteUser(uuid)
    }
}