var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import nodemailer from "nodemailer";
import { injectable } from "tsyringe";
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    async sendEmail(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                html,
            });
        }
        catch (error) {
            throw new Error(`Erreur lors de l'envoi de l'e-mail : ${error.message}`);
        }
    }
};
EmailService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], EmailService);
export { EmailService };
