import { Utilisateur } from 'domain/src/entities/Utilisateurs';
import { LogAdmin } from 'domain/src/entities/LogAdmin';
import { Session } from 'domain/src/entities/session';
import { HistoriqueConsentement } from 'domain/src/entities/historique_consentement';
import { PoolClient } from 'pg';

export interface IUtilisateurRepository {
  initialize(client: PoolClient): unknown;
  // Gestion des utilisateurs
  getAllUtilisateurs(): Promise<Utilisateur[]>;
  getUtilisateurById(id: number): Promise<Utilisateur | null>;
  createUtilisateur(Utilisateur: Utilisateur): Promise<Utilisateur>;
  updateUtilisateur(id: number, utilisateur: Partial<Utilisateur>): Promise<Utilisateur>;
  deleteUtilisateur(id: number): Promise<void>;

  // Gestion des sessions utilisateur
  getUtilisateurSessions(userId: number): Promise<Session[]>;
  createSession(session: Session): Promise<Session>;
  deleteSession(sessionId: number): Promise<void>;

  // Gestion des consentements
  getConsentHistoryByUserId(userId: number): Promise<HistoriqueConsentement[]>;
  addConsentHistory(history: HistoriqueConsentement): Promise<void>;

  // Gestion des logs administratifs
  logAdminAction(log: LogAdmin): Promise<void>;
  getAdminLogs(adminId: number): Promise<LogAdmin[]>;
}
