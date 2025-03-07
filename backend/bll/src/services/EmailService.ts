import nodemailer from "nodemailer";
import { injectable } from "tsyringe";
import { IEmailService } from "../Interfaces/IEmailService";

@injectable()
export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("❌ [ERROR] Les variables d'environnement SMTP ne sont pas correctement définies.");
      throw new Error("Configuration SMTP manquante. Vérifiez votre fichier .env.");
    }

    console.log("✅ [DEBUG] Initialisation du service d'email avec :");
    console.log("🔹 SMTP_HOST:", process.env.SMTP_HOST);
    console.log("🔹 SMTP_PORT:", process.env.SMTP_PORT);
    console.log("🔹 SMTP_USER:", process.env.SMTP_USER);

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,  // Serveur SMTP (ex: smtp.gmail.com)
      port: parseInt(process.env.SMTP_PORT || "2525"), // Port SMTP (587 pour TLS, 465 pour SSL, 2525 pour Mailtrap)
      secure: false, // true pour 465 (SSL), false pour 587 (TLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      console.log(`📧 [DEBUG] Envoi d'un email à ${to}...`);

      await this.transporter.sendMail({
        from: `"Centi-Phone" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      console.log(`✅ [SUCCESS] Email envoyé avec succès à ${to}`);
    } catch (error) {
      console.error("❌ [ERROR] Erreur lors de l'envoi de l'email :", error);
      throw new Error("Erreur lors de l'envoi de l'email.");
    }
  }
}
