import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaModule } from './prisma/modules/prisma.module';
import { UserModule } from './user/modules/user.module';
import { AuthModule } from './auth/modules/auth.module';

@Module({
  imports: [
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
          dir: __dirname + '/templatesEmail',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
  }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule)
  ],
})
export class AppModule {}
