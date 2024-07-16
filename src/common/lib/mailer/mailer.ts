import nodemailer from 'nodemailer';
import {MailOptions} from './mailer.types';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

export  class Mailer {
  transporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendMail(mailOptions: MailOptions) {
    try {
      const transporter = this.transporter();
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }
  }

  mailCustomizer(htmlFilePath: string, replacements: any) {
    const filePath = path.join(__dirname, htmlFilePath);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const htmlToSend = template(replacements);
    return htmlToSend;
  }
  
}