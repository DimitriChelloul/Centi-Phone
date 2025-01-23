import nodemailer from "nodemailer";
import { injectable } from "tsyringe";
import { IEmailService } from "../Interfaces/IEmailService";

//: La classe EmailService est déclarée et exportée pour être utilisée ailleurs dans l'application.
//  Elle implémente l'interface IEmailService. Le décorateur @injectable() est utilisé pour indiquer que cette classe peut être injectée comme dépendance.
@injectable()
export class EmailService implements IEmailService {

  // La propriété transporter est déclarée comme privée et de type nodemailer.Transporter. Elle sera utilisée pour envoyer des emails.
  private transporter: nodemailer.Transporter;

  // Le constructeur initialise la propriété transporter en utilisant la méthode createTransport de nodemailer. 
  // Les paramètres de configuration incluent le service (gmail), l'utilisateur (process.env.EMAIL_USER), et le mot de passe (process.env.EMAIL_PASSWORD).
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Cette méthode est asynchrone et prend trois paramètres :
  //  to (l'adresse email du destinataire), subject (le sujet de l'email), et html (le contenu HTML de l'email). Elle retourne une promesse de type void.
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      //La méthode sendMail du transporter est appelée pour envoyer l'email avec les paramètres fournis (from, to, subject, html).
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
    } catch (error) {
      // Si une erreur survient, elle est capturée dans le bloc catch et une nouvelle erreur est levée avec un message descriptif.
      throw new Error(`Erreur lors de l'envoi de l'e-mail : ${(error as Error).message}`);
    }
  }
}
