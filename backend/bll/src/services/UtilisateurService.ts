import { injectable, inject } from "tsyringe";
import { IUtilisateurRepository } from "../../../dal/src/dal/Interfaces/IUtilisateurRepository";
import { IUtilisateurService } from "../Interfaces/IUtilisateurService";
import { Utilisateur } from '../../../domain/src/entities/Utilisateurs';
import { Session } from '../../../domain/src/entities/session';
import { HistoriqueConsentement } from '../../../domain/src/entities/historique_consentement';
import { LogAdmin } from '../../../domain/src/entities/LogAdmin';
import { IUnitOfWork } from "../../../dal/src/dal/Interfaces/IUnitOfWork";

// La classe UtilisateurService est déclarée et exportée pour être utilisée ailleurs dans l'application.
//  Elle implémente l'interface IUtilisateurService.
//  Le décorateur @injectable() est utilisé pour indiquer que cette classe peut être injectée comme dépendance.
@injectable()
export class UtilisateurService implements IUtilisateurService {
  static deleteUtilisateur: any;

  // Le constructeur prend un paramètre utilisateurRepo de type IUtilisateurRepository.
  //  Le décorateur @inject("IUtilisateurRepository") est utilisé pour injecter une instance de IUtilisateurRepository dans la propriété utilisateurRepo.
  constructor(@inject("IUtilisateurRepository") private utilisateurRepo: IUtilisateurRepository) {}

  //Cette méthode est asynchrone et retourne une promesse de type tableau de Utilisateur.
  async getAllUtilisateurs(): Promise<Utilisateur[]> {
    //appelle la méthode getAllUtilisateurs du repository d'utilisateurs pour récupérer tous les utilisateurs.
    return this.utilisateurRepo.getAllUtilisateurs();
  }

  //Cette méthode est asynchrone et prend un paramètre id (l'ID de l'utilisateur). Elle retourne une promesse de type Utilisateur ou null.
  async getUtilisateurById(id: number): Promise<Utilisateur | null> {
    // appelle la méthode getUtilisateurById du repository d'utilisateurs pour récupérer un utilisateur par son ID.
    return this.utilisateurRepo.getUtilisateurById(id);
  }

  //Cette méthode est asynchrone et prend un paramètre utilisateur de type Utilisateur. Elle retourne une promesse de type Utilisateur
  async createUtilisateur(utilisateur: Utilisateur): Promise<Utilisateur> {
    // appelle la méthode createUtilisateur du repository d'utilisateurs pour créer un nouvel utilisateur
    return this.utilisateurRepo.createUtilisateur(utilisateur);
  }

 // Cette méthode est asynchrone et prend deux paramètres : l'ID de l'utilisateur et un objet partiel de type Utilisateur. Elle retourne une promesse de type Utilisateur.
async updateUtilisateur(id: number, utilisateur: Partial<Utilisateur>): Promise<Utilisateur> {
  // Appelle la méthode updateUtilisateur du repository d'utilisateurs pour mettre à jour un utilisateur.
  return this.utilisateurRepo.updateUtilisateur(id, utilisateur);
}

  // Cette méthode est asynchrone et prend un paramètre id (l'ID de l'utilisateur). Elle retourne une promesse de type void
  async deleteUtilisateur(id: number): Promise<void> {
    //appelle la méthode deleteUtilisateur du repository d'utilisateurs pour supprimer un utilisateur par son ID.
    return this.utilisateurRepo.deleteUtilisateur(id);
  }

  // Cette méthode est asynchrone et prend deux paramètres : 
  // utilisateurId (l'ID de l'utilisateur) et token (le token de session). Elle retourne une promesse de type Session.
  async createSession(utilisateurId: number, token: string): Promise<Session> {

    // Une nouvelle instance de Session est créée avec les informations fournies. La date d'expiration est définie à 7 jours à partir de la date actuelle.
    const session = new Session({
      utilisateurId,
      tokenHash: token,
      dateCreation: new Date(),
      dateExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
      statut: "actif",
    });
    // La méthode createSession du repository d'utilisateurs est appelée pour créer une nouvelle session.
    return this.utilisateurRepo.createSession(session);
  }

  // Cette méthode est asynchrone et prend un paramètre sessionId (l'ID de la session). Elle retourne une promesse de type void.
  async revokeSession(sessionId: number): Promise<void> {
    //appelle la méthode deleteSession du repository d'utilisateurs pour révoquer une session par son ID.
    return this.utilisateurRepo.deleteSession(sessionId);
  }

  //Cette méthode est asynchrone et prend un paramètre utilisateurId (l'ID de l'utilisateur). Elle retourne une promesse de type tableau de Session
  async getUtilisateurSessions(utilisateurId: number): Promise<Session[]> {
    //appelle la méthode getUtilisateurSessions du repository d'utilisateurs pour récupérer les sessions d'un utilisateur par son ID
    return this.utilisateurRepo.getUtilisateurSessions(utilisateurId);
  }

  // Cette méthode est asynchrone et prend un paramètre utilisateurId (l'ID de l'utilisateur). Elle retourne une promesse de type tableau de HistoriqueConsentement
  async getConsentHistory(utilisateurId: number): Promise<HistoriqueConsentement[]> {
    // appelle la méthode getConsentHistoryByUserId du repository d'utilisateurs pour récupérer l'historique des consentements d'un utilisateur par son ID.
    return this.utilisateurRepo.getConsentHistoryByUserId(utilisateurId);
  }

  // Cette méthode est asynchrone et prend plusieurs paramètres : utilisateurId (l'ID de l'utilisateur), typeConsentement (le type de consentement), 
  // statut (le statut du consentement), source (la source, optionnelle), et adresseIp (l'adresse IP, optionnelle).
  //  Elle retourne une promesse de type void.
  async addConsentHistory(
    utilisateurId: number,
    typeConsentement: string,
    statut: boolean,
    source?: string,
    adresseIp?: string
  ): Promise<void> {

    //Une nouvelle instance de HistoriqueConsentement est créée avec les informations fournies
    const history = new HistoriqueConsentement({
      utilisateurId,
      typeConsentement,
      statut,
      dateModification: new Date(),
      source,
      adresseIp,
    });
    //La méthode addConsentHistory du repository d'utilisateurs est appelée pour ajouter l'historique de consentement.
    await this.utilisateurRepo.addConsentHistory(history);
  }

  //Cette méthode est asynchrone et prend deux paramètres : adminId (l'ID de l'administrateur) et action (l'action effectuée). Elle retourne une promesse de type void.
  async logAdminAction(adminId: number, action: string): Promise<void> {
    // Une nouvelle instance de LogAdmin est créée avec les informations fournies.
    const log = new LogAdmin({ adminId, action, dateAction: new Date() });
    //: La méthode logAdminAction du repository d'utilisateurs est appelée pour enregistrer le log de l'action administrative.
    await this.utilisateurRepo.logAdminAction(log);
  }

  // Cette méthode est asynchrone et prend un paramètre adminId (l'ID de l'administrateur). Elle retourne une promesse de type tableau de LogAdmin
  async getAdminLogs(adminId: number): Promise<LogAdmin[]> {
    // appelle la méthode getAdminLogs du repository d'utilisateurs pour récupérer les logs des actions administratives par l'ID de l'administrateur.
    return this.utilisateurRepo.getAdminLogs(adminId);
  }
}
