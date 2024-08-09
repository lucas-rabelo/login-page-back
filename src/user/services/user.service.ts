import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "src/prisma/services/prisma.service";

import { CreateUserDto } from "../domain/dto/create-user.dto";
import { UpdatePutUserDto } from "../domain/dto/update-put-user.dto";
import { UpdatePatchUserDto } from "../domain/dto/update-patch-user.dto";

import { User } from "@prisma/client";
@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async postUser(data: CreateUserDto): Promise<User> {
        try {
            if(data.password) {
                data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
            }

            return this.prismaService.user.create({
                data,
            });
        } catch(error) {
            throw new BadRequestException(error);
        }
    }

    async getUserByUuid(uuid: string): Promise<User> {
        try {
            return this.prismaService.user.findUnique({
                where: {
                    uuid
                }
            });
        } catch(error) {
            throw new BadRequestException(error);
        }
    }

    async getUserByEmailAndSub(email: string, sub: string) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email,
                    googleSub: sub
                }
            });

            if(!user) {
                return null;
            }
            return user;
        } catch(error) {
            throw new BadRequestException(error);
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email
                }
            });

            if(!user) {
                return null;
            }
            return user;
        } catch(error) {
            throw new BadRequestException(error);
        }
    }

    async listUser(
        page: number,
        itemsPerPage: number,
        search?: string
    ): Promise<[User[], number]> {
        const skip = Number((page - 1) * itemsPerPage);
        const take = Number(itemsPerPage);

        const query = this.prismaService.user;

        try {
            const total = await query.count({
                where: {
                    OR: [
                        { name: { contains: search || '', mode: 'insensitive' } },
                    ],
                }
            });

            const users = await query.findMany({
                orderBy: [
                    {
                        createdAt: 'desc'
                    }
                ],
                where: {
                    OR: [
                        { name: { contains: search || '', mode: 'insensitive' } },
                    ],
                },
                skip,
                take
            });

            return [ users, total ];
        } catch(error) {
            throw new BadRequestException(error);
        }
    }

    async updateUser(uuid: string, data: UpdatePutUserDto): Promise<User> {
        await this.existUser(uuid);

        try {
            data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
    
            return this.prismaService.user.update({
                where: {
                    uuid
                },
                data
            });
        } catch(error) {
            throw new BadRequestException(error);
        }
    }

    async patchUser(uuid: string, data: UpdatePatchUserDto): Promise<User> {
        await this.existUser(uuid);

        try {
            if(data.password) {
                data.password = await bcrypt.hash(data.password, await bcrypt.genSalt())
            }
    
            return this.prismaService.user.update({
                where: {
                    uuid
                },
                data
            });
        } catch(error) {
            throw new BadRequestException(error);
        }
    }

    async deleteUser(uuid: string): Promise<User> {
        await this.existUser(uuid);

        try {
            return await this.prismaService.user.delete({
                where: {
                    uuid
                }
            });
        } catch(error) {
            throw new BadRequestException(error);
        }
    }

    async existUser(uuid: string) {
        if(!(await this.getUserByUuid(uuid))) {
            throw new NotFoundException(`o usuário ${uuid} não foi encontrado.`);
        }
    }
}