import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  readonly simulated: boolean;

  constructor() {
    // Without SMTP credentials, emails are only logged so the public demo can't be used to send spam
    this.simulated = !process.env.SMTP_HOST;
    this.transporter = this.simulated
      ? nodemailer.createTransport({ jsonTransport: true })
      : nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '465', 10),
          secure: (process.env.SMTP_PORT || '465') === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
  }

  async sendMail(options: { to: string; subject: string; text: string }) {
    const result = await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'demo@abroad-study.local',
      ...options,
    });
    if (this.simulated) {
      this.logger.log(`Simulated email to ${options.to}: ${options.subject}`);
    }
    return { simulated: this.simulated, messageId: result.messageId };
  }
}
