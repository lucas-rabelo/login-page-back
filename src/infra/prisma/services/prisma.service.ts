import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    prisma = new PrismaClient();
    constructor() {
        super({
            log: ['query']
        })
    }

    async onModuleInit() {
        await this.prisma.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        process.on('beforeExit', async () => {
            await app.close();
        })
    }
}