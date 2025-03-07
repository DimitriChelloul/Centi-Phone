import { injectable, inject } from "tsyringe";
import { IRepairRepository } from "../../../dal/src/dal/Interfaces/IReparationRepository";
import { IRepairService } from "../Interfaces/IReparationService";
import { Rdv } from '../../../domain/src/entities/rdv';
import { SuiviReparation } from '../../../domain/src/entities/suivi_reparation';
import { Devis } from '../../../domain/src/entities/devis';
import { IUnitOfWork } from "../../../dal/src/dal/Interfaces/IUnitOfWork"
import { IEmailService } from "../Interfaces/IEmailService";

// La classe RepairService est déclarée et exportée pour être utilisée ailleurs dans l'application.
//  Elle implémente l'interface IRepairService. Le décorateur @injectable() est utilisé pour indiquer que cette classe peut être injectée comme dépendance.
@injectable()
export class RepairService implements IRepairService {

  
  //Constructeur de la classe RepairService : Le constructeur prend trois paramètres :
  //repairRepo de type IRepairRepository : Injecté avec le décorateur @inject("IReparationRepository").
  //unitOfWork de type IUnitOfWork : Injecté avec le décorateur @inject("IUnitOfWork").
  //emailService de type IEmailService : Injecté avec le décorateur @inject("IEmailService").
  constructor(
    @inject("IReparationRepository") private repairRepo: IRepairRepository,
    @inject("IUnitOfWork") private unitOfWork: IUnitOfWork,
    @inject("IEmailService") private emailService: IEmailService
  ) {}

  // Cette méthode est asynchrone et prend trois paramètres :
  //  utilisateurId (l'ID de l'utilisateur), email (l'adresse email de l'utilisateur), et dateRdv (la date du rendez-vous).
  //  Elle retourne une promesse de type void.
  async createRdv(id: number, problemeDescription: string | undefined, dateRdv: Date): Promise<void> {
    // Vérifie si la date est valide
    if (!(dateRdv instanceof Date) || isNaN(dateRdv.getTime())) {
        throw new Error("Format de date invalide.");
    }

    await this.unitOfWork.start();

    try {

      console.log("🔹 [DEBUG] Données envoyées à la DAL :", {
        id,
        problemeDescription,
        dateRdv
    });
        // Étape 1 : Récupérer les informations de l'utilisateur
        const utilisateur = await this.unitOfWork.utilisateurRepository.getUtilisateurById(id);
        if (!utilisateur) {
            throw new Error("Utilisateur non trouvé.");
        }

        // Étape 2 : Créer le rendez-vous
        const rdv = await this.unitOfWork.repairRepository.createRdv({
           utilisateurId: id,
            problemeDescription,
            dateRendezVous: dateRdv,
            statut: "en attente",
        });

        // Étape 3 : Envoyer un e-mail de confirmation
        const emailHtml = `
            <h1>Confirmation de votre rendez-vous</h1>
            <p>Bonjour ${utilisateur.prenom},</p>
            <p>Votre rendez-vous est confirmé pour le ${dateRdv.toLocaleString()}.</p>
            <p>Description du problème : ${problemeDescription || "Non spécifiée"}.</p>
            <p>Merci de votre confiance.</p>
        `;
        await this.emailService.sendEmail(utilisateur.email, "Confirmation de votre rendez-vous", emailHtml);

        await this.unitOfWork.commit();
    } catch (error) {
        await this.unitOfWork.rollback();
        throw error;
    }
}


    // Cette méthode est asynchrone et prend un paramètre : utilisateurId (l'ID de l'utilisateur). Elle retourne une promesse de type tableau de Rdv
  async getRdvsByUserId(utilisateurId: number): Promise<Rdv[]> {
    //appelle la méthode getRdvByUserId du repository de réparations pour récupérer les rendez-vous de l'utilisateur par son ID.
    return this.repairRepo.getRdvByUserId(utilisateurId);
  }

  // Cette méthode est asynchrone et prend un paramètre : rdvId (l'ID du rendez-vous). Elle retourne une promesse de type Rdv ou null
  async getRdvById(rdvId: number): Promise<Rdv | null> {
    //appelle la méthode getRdvById du repository de réparations pour récupérer un rendez-vous par son ID.
    return this.repairRepo.getRdvById(rdvId);
  }

  // Cette méthode est asynchrone et prend un paramètre : rdvId (l'ID du rendez-vous). Elle retourne une promesse de type void
  async cancelRdv(rdvId: number): Promise<void> {
    // appelle la méthode deleteRdv du repository de réparations pour annuler un rendez-vous par son ID
    await this.repairRepo.deleteRdv(rdvId);
  }

  // Cette méthode est asynchrone et prend deux paramètres :
  //  rdvId (l'ID du rendez-vous) et statut (le statut de la réparation, qui peut être "en cours" ou "terminé").
  //  Elle retourne une promesse de type void
  async addSuiviReparation(rdvId: number, statut: "en cours" | "termine"): Promise<void> {
    // Une nouvelle instance de SuiviReparation est créée avec les informations fournies.
    const suivi = new SuiviReparation({ rendezVousId: rdvId, statut, dateStatut: new Date() });
    // La méthode addSuiviReparation du repository de réparations est appelée pour ajouter le suivi de réparation
    await this.repairRepo.addSuiviReparation(suivi);
  }

  // Cette méthode est asynchrone et prend un paramètre : rdvId (l'ID du rendez-vous). Elle retourne une promesse de type tableau de SuiviReparation
  async getSuiviReparationByRdvId(rdvId: number): Promise<SuiviReparation[]> {
    //appelle la méthode getSuiviReparationByRdvId du repository de réparations pour récupérer les suivis de réparation par l'ID du rendez-vous.
    return this.repairRepo.getRSuiviReparationByAppointmentId(rdvId);
  }

  //Cette méthode est asynchrone et prend deux paramètres : utilisateurId (l'ID de l'utilisateur) et devis (l'objet devis). Elle retourne une promesse de type Devis.
  async createDevis(utilisateurId: number, devis: Devis): Promise<Devis> {
    //Les propriétés utilisateurId, dateCreation, et statut du devis sont initialisées.
    devis.utilisateurId = utilisateurId;
    devis.dateCreation = new Date();
    devis.statut = "en attente";
    // La méthode createDevis du repository de réparations est appelée pour créer un nouveau devis.
    return this.repairRepo.createDevis(devis);
  }

  //Cette méthode est asynchrone et prend un paramètre : utilisateurId (l'ID de l'utilisateur). Elle retourne une promesse de type tableau de Devis
  async getDevisByUserId(utilisateurId: number): Promise<Devis[]> {
    //appelle la méthode getDevisByUserId du repository de réparations pour récupérer les devis de l'utilisateur par son ID
    return this.repairRepo.getDevisByUserId(utilisateurId);
  }

  // Cette méthode est asynchrone et prend un paramètre : devisId (l'ID du devis). Elle retourne une promesse de type Devis ou null
  async getDevisById(devisId: number): Promise<Devis | null> {
    //appelle la méthode getDevisById du repository de réparations pour récupérer un devis par son ID.
    return this.repairRepo.getDevisById(devisId);
  }

  // Cette méthode est asynchrone et prend deux paramètres :
  //  devisId (l'ID du devis) et statut (le nouveau statut du devis, qui peut être "en attente", "accepté", ou "refusé").
  //  Elle retourne une promesse de type Devis
  async updateDevisStatus(devisId: number, statut: "en attente" | "accepte" | "refuse"): Promise<Devis> {
    // La méthode getDevisById du repository de réparations est appelée pour récupérer le devis par son ID.
    const devis = await this.repairRepo.getDevisById(devisId);
    // Si le devis n'est pas trouvé, une erreur est levée.
    if (!devis) throw new Error("Devis not found");
    // Le statut du devis est mis à jour.
    devis.statut = statut;
    // La méthode updateDevis du repository de réparations est appelée pour mettre à jour le devis.
    return this.repairRepo.updateDevis(devis);
  }

    /**
   * Met à jour le statut d'une réparation et envoie un e-mail détaillé de confirmation.
   * @param rendezVousId - ID du rendez-vous.
   * @param statut - Nouveau statut de la réparation ('en cours', 'terminé').
   * @param clientEmail - Adresse e-mail du client.
   * @param clientName - Nom du client.
   */
    async updateStatutReparation(
      rendezVousId: number,
      statut: string,
      clientEmail: string,
      clientName: string
    ): Promise<void> {
      // La méthode start de l'unité de travail est appelée pour démarrer une nouvelle transaction.
      await this.unitOfWork.start();
  
      try {
        // Étape 1 : Ajouter une entrée dans le suivi de réparation
        //Une nouvelle entrée de suivi de réparation est créée avec les informations fournies
        const suivi: SuiviReparation = {
          rendezVousId,
          statut: statut as "en cours" | "termine",
          dateStatut: new Date(),
        
        };
        // La méthode addSuiviReparation du repository de réparations est appelée pour ajouter le suivi de réparation
        await this.unitOfWork.repairRepository.addSuiviReparation(suivi);
  
        // La méthode commit de l'unité de travail est appelée pour valider la transaction.
        await this.unitOfWork.commit();
  
        // Étape 2 : Envoyer un e-mail de confirmation avec des détails
        // Le contenu de l'email de confirmation est défini dans la variable emailHtml.
        const emailHtml = `
          <h1>🔧 Mise à jour de votre réparation</h1>
          <p>Bonjour <strong>${clientName}</strong>,</p>
          <p>Nous souhaitons vous informer que le statut de votre réparation a été mis à jour :</p>
          
          <table border="1" cellspacing="0" cellpadding="10">
            <tr>
              <td><strong>ID du rendez-vous :</strong></td>
              <td>${rendezVousId}</td>
            </tr>
            <tr>
              <td><strong>Statut actuel :</strong></td>
              <td>${statut === "en cours" ? "🔄 En cours" : "✅ Terminé"}</td>
            </tr>
            <tr>
              <td><strong>Date de mise à jour :</strong></td>
              <td>${new Date().toLocaleString()}</td>
            </tr>
          </table>
  
          <p>Nous vous tiendrons informé de toute évolution supplémentaire.</p>
          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
  
          <br />
          <p>Merci de votre confiance,</p>
          <p><strong>L'équipe de réparation</strong></p>
        `;
  
        // L'email de confirmation est envoyé au client en utilisant la méthode sendEmail du service d'email.
        await this.emailService.sendEmail(
          clientEmail,
          "🔧 Mise à jour de votre réparation",
          emailHtml
        );
      } catch (error) {
        // Si une erreur survient,
        //  la transaction est annulée en utilisant la méthode rollback de l'unité de travail,
        //  et une nouvelle erreur est levée avec un message descriptif.
        await this.unitOfWork.rollback();
        throw new Error(`Erreur lors de la mise à jour du statut : ${(error as Error).message}`);
      }
    }
}
