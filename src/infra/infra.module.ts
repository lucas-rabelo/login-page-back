import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/modules/prisma.module";

@Module({
  imports: [PrismaModule],
  exports: [PrismaModule],
})
export class InfraModule {};