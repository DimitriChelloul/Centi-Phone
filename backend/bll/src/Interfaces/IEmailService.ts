export interface IEmailService {
    /**
     * Envoie un e-mail avec le destinataire, le sujet et le contenu HTML.
     * @param to - Adresse e-mail du destinataire.
     * @param subject - Sujet de l'e-mail.
     * @param html - Contenu HTML de l'e-mail.
     */
    sendEmail(to: string, subject: string, html: string): Promise<void>;
  }
  