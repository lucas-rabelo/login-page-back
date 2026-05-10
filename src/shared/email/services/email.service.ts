import { Injectable } from "@nestjs/common";

import { MailerService } from "@nestjs-modules/mailer";
import type { SendEmailDto } from "../domain/dto/send-email.dto";

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
    ) { }

    async sendEmail({ token, user, subject, template }: SendEmailDto) {
        const url = `${process.env.URL_FRONT}/reset_password/${token}`;

        const response = await this.mailerService.sendMail({
            subject,
            to: user.email,
            template,
            context: {
                name: user.name,
                url
            },
        });

        return !!response;
    }
}