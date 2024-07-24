import { Mailer, MailOptions, MailTemplate } from "@/common/lib/mailer";
import { Service } from "typedi";
import { IActivationMailReplacement } from "./course.dto";
import ErrorHandler from "@/common/utils/error-handler";

@Service()
export default class CourseMailer extends Mailer {

    async sendActivationMail(courseEmail: string, replacements: IActivationMailReplacement) {
        try {
            const htmlToSend = await this.mailCustomizer(MailTemplate.ActivationTemplate, replacements)
            const mailOption: MailOptions = {
                from: "<Savvy learning platform>",
                to: courseEmail,
                subject: "ACTIVATION MAIL",
                html: htmlToSend
            }

            this.sendMail(mailOption);
        } catch (err) {
            console.log("THE ERROR", err)
            throw (new ErrorHandler(`An Error Occur while processing your request`, 500))
        }

    }
}