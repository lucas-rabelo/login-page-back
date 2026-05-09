import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../prisma/services/prisma.service";
import { HashService } from "../../shared/hash/services/hash.service";

import { CreateUserDto } from "../domain/dto/create-user.dto";
import { UpdatePatchUserDto } from "../domain/dto/update-patch-user.dto";
import { UpdatePutUserDto } from "../domain/dto/update-put-user.dto";

import { User } from "@prisma/client";
@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly hashService: HashService,
    ) { }

    async postUser(data: CreateUserDto): Promise<User> {
        if (data.password) {
            data.password = await this.hashService.hash(data.password);
        }

        return this.prismaService.user.create({
            data: {
                name: data.name,
                email: data.email,
                birthDate: data.birthDate,
                role: data.role,
                password: data.password,
                googleSub: data.googleSub,
            },
        });
    }

    async getUserByUuid(uuid: string): Promise<User> {
        return this.prismaService.user.findUnique({
            where: {
                uuid
            }
        });
    }

    async getUserByEmailAndSub(email: string, sub: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
                googleSub: sub
            }
        });

        if (!user) {
            return null;
        }
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return null;
        }
        return user;
    }

    async listUser(
        page: number,
        itemsPerPage: number,
        search?: string
    ): Promise<[User[], number]> {
        const skip = Number((page - 1) * itemsPerPage);
        const take = Number(itemsPerPage);

        const query = this.prismaService.user;
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search || '', mode: 'insensitive' } }
            ]
        }

        const total = await query.count({
            where
        });

        const users = await query.findMany({
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ],
            where,
            skip,
            take
        });

        return [users, total];
    }

    async updateUser(uuid: string, data: UpdatePutUserDto): Promise<User> {
        await this.existUser(uuid);
        data.password = await this.hashService.hash(data.password);

        return this.prismaService.user.update({
            where: {
                uuid
            },
            data
        });
    }

    async patchUser(uuid: string, data: UpdatePatchUserDto): Promise<User> {
        await this.existUser(uuid);

        if (data.password) {
            data.password = await this.hashService.hash(data.password);
        }

        return this.prismaService.user.update({
            where: {
                uuid
            },
            data
        });

    }

    async deleteUser(uuid: string): Promise<User | null> {
        const userFounded = await this.existUser(uuid);

        if (!userFounded) return null;

        return await this.prismaService.user.delete({
            where: {
                uuid
            }
        });
    }

    async existUser(uuid: string) {
        const userFounded = await this.getUserByUuid(uuid)
        return !!userFounded;
    }
}