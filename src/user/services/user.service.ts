import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "src/prisma/services/prisma.service";

import { CreateUserDto } from "../dto/create-user.dto";
import { UpdatePutUserDto } from "../dto/update-put-user.dto";
import { UpdatePatchUserDto } from "../dto/update-patch-user.dto";
import { ReadUserDto } from "../dto/read-user.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async postUser(data: CreateUserDto) {
        data.password = await bcrypt.hash(data.password, await bcrypt.genSalt())

        return this.prismaService.user.create({
            data,
        });
    }

    async getUserByUuid(uuid: string): Promise<ReadUserDto> {
        const user = await this.prismaService.user.findUnique({
            where: {
                uuid
            }
        });

        return {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            birthDate: user.birthDate,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    async getUserByEmail(email: string, newUser?: boolean) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if(newUser) {
            if(user) {
                throw new ConflictException('Este e-mail já está em uso');
            }

            return user;
        } else {
            if(!user) {
                throw new NotFoundException('Usuário não encontrado');
            }
            return user;
        }
    }

    async listUser(): Promise<ReadUserDto[]> {
        const users = await this.prismaService.user.findMany();

        return users.map(user => ({
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            birthDate: user.birthDate,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }))
    }

    async updateUser(uuid: string, data: UpdatePutUserDto): Promise<ReadUserDto> {
        await this.existUser(uuid);

        data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());

        const user = await this.prismaService.user.update({
            where: {
                uuid
            },
            data
        });

        return {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            birthDate: user.birthDate,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    async patchUser(uuid: string, data: UpdatePatchUserDto): Promise<ReadUserDto> {
        await this.existUser(uuid);

        if(data.password) {
            data.password = await bcrypt.hash(data.password, await bcrypt.genSalt())
        }

        const user = await this.prismaService.user.update({
            where: {
                uuid
            },
            data
        });

        return {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            birthDate: user.birthDate,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    async deleteUser(uuid: string): Promise<ReadUserDto> {
        await this.existUser(uuid);

        const user = await this.prismaService.user.delete({
            where: {
                uuid
            }
        });

        return {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            birthDate: user.birthDate,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    async existUser(uuid: string) {
        if(!(await this.getUserByUuid(uuid))) {
            throw new NotFoundException(`o usuário ${uuid} não foi encontrado.`);
        }
    }
}