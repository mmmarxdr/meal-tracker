import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IEmailSender } from '../../application/ports/email-sender.interface';
import { NodemailerEmailSender } from './nodemailer-email-sender';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IEmailSender,
      useClass: NodemailerEmailSender,
    },
  ],
  exports: [IEmailSender],
})
export class EmailModule {}
