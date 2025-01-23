import { Utilisateur } from '../../../domain/src/entities/Utilisateurs';
import { Session } from '../../../domain/src/entities/session';
import { HistoriqueConsentement } from '../../../domain/src/entities/historique_consentement';
import { LogAdmin } from '../../../domain/src/entities/LogAdmin';

export interface IUtilisateurService {
  // Gestion des utilisateurs
  getAllUtilisateurs(): Promise<Utilisateur[]>;
  getUtilisateurById(id: number): Promise<Utilisateur | null>;
  createUtilisateur(utilisateur: Utilisateur): Promise<Utilisateur>;
  updateUtilisateur(id: number, utilisateur: Partial<Utilisateur>): Promise<Utilisateur>;
  deleteUtilisateur(id: number): Promise<void>;

  // Gestion des sessions utilisateur
  createSession(utilisateurId: number, token: string): Promise<Session>;
  revokeSession(sessionId: number): Promise<void>;
  getUtilisateurSessions(utilisateurId: number): Promise<Session[]>;

  // Gestion des consentements
  getConsentHistory(utilisateurId: number): Promise<HistoriqueConsentement[]>;
  addConsentHistory(utilisateurId: number, typeConsentement: string, statut: boolean, source?: string, adresseIp?: string): Promise<void>;

  // Logs administratifs
  logAdminAction(adminId: number, action: string): Promise<void>;
  getAdminLogs(adminId: number): Promise<LogAdmin[]>;
}
