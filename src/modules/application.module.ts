import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import { ConfigModule } from "@nestjs/config";

import { UserModule } from "./user/modules/user.module";
import { AuthModule } from "./auth/modules/auth.module";
import { PrismaModule } from "../infra/prisma/modules/prisma.module";

const modules = [
  UserModule,
  AuthModule
];

@Module({
  imports: [
    ...modules,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        PrismaModule,
        MailerModule.forRoot({
          transport: {
            host: process.env.MAILTRAP_HOST,
            port: Number(process.env.MAILTRAP_PORT),
            secure: false,
            auth: {
              user: process.env.MAILTRAP_USERNAME,
              pass: process.env.MAILTRAP_PASSWORD,
            },
          },
          defaults: {
            from: '"Login Suporte" <login_suporte@email.com>',
          },
          template: {
            dir: __dirname + '/shared/email/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        })
  ],
  exports: modules,
})
export class ApplicationModule {};