import { query, pool } from '../config/db'; // Connexion à la base de données
import { IUtilisateurRepository } from '../Interfaces/IUtilisateurRepository';
import { Utilisateur } from '../../../../domain/src/entities/Utilisateurs';
import { LogAdmin } from '../../../../domain/src/entities/LogAdmin';
import { Session } from '../../../../domain/src/entities/session';
import { HistoriqueConsentement } from '../../../../domain/src/entities/historique_consentement';
import { inject, injectable } from "tsyringe";
import { Pool, PoolClient } from 'pg';//Importe les classes Pool et PoolClient de la bibliothèque pg pour la gestion des connexions à la base de données PostgreSQL.
                                      //  Pool gère un ensemble de connexions réutilisables, tandis que PoolClient représente une connexion individuelle.

//Déclare la classe UtilisateurRepository comme injectable et implémente l'interface IUtilisateurRepository.

@injectable()
export class UtilisateurRepository implements IUtilisateurRepository {
  //  La propriété client est déclarée pour stocker l'instance de PoolClient
  private client!: PoolClient;

  //Le constructeur de la classe injecte une instance de Pool nommée "DatabasePool" et l'assigne à la propriété pool.
  constructor(@inject("DatabasePool") private pool: Pool) {}

  //La méthode initialize initialise la connexion à la base de données.
  async initialize(client?: PoolClient): Promise<void> {
    if (client) {
      this.client = client; // Si un PoolClient est fourni (via UnitOfWork), on l'utilise
    } else {
      // Sinon, on obtient un client du pool global
      try {
        this.client = await this.pool.connect();
      } catch (err) {
        //Si une erreur survient lors de la connexion, une exception est levée avec un message d'erreur approprié
        if (err instanceof Error) {
          throw new Error(`Error connecting to the database: ${err.message}`);
        } else {
          throw new Error("An unknown error occurred while connecting to the database.");
        }
      }
    }
  }

  // Gestion des utilisateurs
  //La méthode getAllUtilisateurs récupère tous les utilisateurs de la base de données et les retourne sous forme de tableau d'instances de Utilisateur.
  async getAllUtilisateurs(): Promise<Utilisateur[]> {
    try {
      //La methode query du client est appelée pour executer la requete de recuperation des utilisateurs
      const result = await pool.query('SELECT * FROM utilisateurs');
      //les resultats de la requete sont mappés en entites de type utilisateur
      return result.rows.map((row) => new Utilisateur(row));
    } catch (error) {
      if (error instanceof Error) {
         //Si une erreur survient, une exception est levée avec un message d'erreur approprié.
        throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
      } else {
        throw new Error(`Erreur inconnue lors de la récupération des utilisateurs: ${JSON.stringify(error)}`);
      }
    }
  }

  //La méthode getUtilisateurById récupère un utilisateur par son ID et le retourne sous forme d'instance de Utilisateur ou null si l'utilisateur n'est pas trouvé.
  async getUtilisateurById(id: number): Promise<Utilisateur | null> {
    try {
      //La methode query du client est appelée pour executer la requete sql de recuperation d un utilisateur par son id.
      const result = await pool.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);
     // Si un utilisateur est trouvée, une nouvelle instance de Utilisateur est créée avec les données retournées par la requête et est retournée. Sinon, null est retourné.
      return result.rows.length > 0 ? new Utilisateur(result.rows[0]) : null;
    } catch (error) {
      //Si une erreur survient, une exception est levée avec un message d'erreur approprié.
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la récupération de l'utilisateur avec l'ID ${id}: ${error.message}`);
      } else {
        throw new Error(`Erreur inconnue lors de la récupération de l'utilisateur avec l'ID ${id}: ${JSON.stringify(error)}`);
      }
    }
  }


  //La méthode createUtilisateur insère un nouvel utilisateur dans la base de données et retourne l'utilisateur créé.
  async createUtilisateur(utilisateur: Utilisateur): Promise<Utilisateur> {
    try {
      //La methode query du client est appelée pour executer la requete sql de creation d un utilisateur.les valeurs des champs sont passés en parametres
      const result = await pool.query(
        `INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, telephone, adresse, code_postal, ville, role, consentement_rgpd)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          utilisateur.nom,
          utilisateur.prenom,
          utilisateur.email,
          utilisateur.mot_de_passe,
          utilisateur.telephone,
          utilisateur.adresse,
          utilisateur.codePostal,
          utilisateur.ville,
          utilisateur.role,
          utilisateur.consentementRgpd,
        ]
      );
      return new Utilisateur(result.rows[0]);
    } catch (error) {
      //Si une erreur survient, une exception est levée avec un message d'erreur approprié.
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
      } else {
        throw new Error(`Erreur inconnue lors de la création de l'utilisateur: ${JSON.stringify(error)}`);
      }
    }
  }

  // La méthode updateUtilisateur met à jour les informations d'un utilisateur dans la base de données et retourne l'utilisateur mis à jour.
async updateUtilisateur(id: number, utilisateur: Partial<Utilisateur>): Promise<Utilisateur> {
  try {
      // Construire la requête SQL en fonction des champs fournis
      let query = 'UPDATE utilisateurs SET ';
      const values: any[] = [];
      let index = 1;

      if (utilisateur.nom !== undefined) {
          query += `nom = $${index}, `;
          values.push(utilisateur.nom);
          index++;
      }
      if (utilisateur.prenom !== undefined) {
          query += `prenom = $${index}, `;
          values.push(utilisateur.prenom);
          index++;
      }
      if (utilisateur.email !== undefined) {
          query += `email = $${index}, `;
          values.push(utilisateur.email);
          index++;
      }
      if (utilisateur.mot_de_passe !== undefined) {
          query += `mot_de_passe = $${index}, `;
          values.push(utilisateur.mot_de_passe);
          index++;
      }
      if (utilisateur.telephone !== undefined) {
          query += `telephone = $${index}, `;
          values.push(utilisateur.telephone);
          index++;
      }
      if (utilisateur.adresse !== undefined) {
          query += `adresse = $${index}, `;
          values.push(utilisateur.adresse);
          index++;
      }
      if (utilisateur.codePostal !== undefined) {
          query += `code_postal = $${index}, `;
          values.push(utilisateur.codePostal);
          index++;
      }
      if (utilisateur.ville !== undefined) {
          query += `ville = $${index}, `;
          values.push(utilisateur.ville);
          index++;
      }
      if (utilisateur.role !== undefined) {
          query += `role = $${index}, `;
          values.push(utilisateur.role);
          index++;
      }

      // Supprimer la virgule et l'espace à la fin de la requête
      query = query.slice(0, -2);

      // Ajouter la clause WHERE
      query += ` WHERE id = $${index}`;
      values.push(id);

      // Ajouter la clause RETURNING
      query += ' RETURNING *';

      // Exécuter la requête
      const result = await pool.query(query, values);
      return new Utilisateur(result.rows[0]);
  } catch (error) {
      // Si une erreur survient, une exception est levée avec un message d'erreur approprié.
      if (error instanceof Error) {
          throw new Error(`Erreur lors de la mise à jour de l'utilisateur avec l'ID ${id}: ${error.message}`);
      } else {
          throw new Error(`Erreur inconnue lors de la mise à jour de l'utilisateur avec l'ID ${id}: ${JSON.stringify(error)}`);
      }
  }
}


  //La méthode deleteUtilisateur supprime un utilisateur de la base de données par son ID.
  async deleteUtilisateur(id: number): Promise<void> {
    try {
      //La methode query du client est appelée pour executer la requete sql de suppression d un utilisateur
      await pool.query('DELETE FROM utilisateurs WHERE id = $1', [id]);
    } catch (error) {
      //Si une erreur survient, une exception est levée avec un message d'erreur approprié.
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la suppression de l'utilisateur avec l'ID ${id}: ${error.message}`);
      } else {
        throw new Error(`Erreur inconnue lors de la suppression de l'utilisateur avec l'ID ${id}: ${JSON.stringify(error)}`);
      }
    }
  }

  // Gestion des sessions utilisateur
  //La méthode getUtilisateurSessions récupère toutes les sessions d'un utilisateur par son ID et les retourne sous forme de tableau d'instances de Session.
  async getUtilisateurSessions(userId: number): Promise<Session[]> {
    try {
      //La methode query du client est appelée pour executer la requete sql pour recuperer la session d un utilisateur
      const result = await pool.query('SELECT * FROM sessions WHERE utilisateur_id = $1', [userId]);
      // Les résultats de la requête sont mappés en instances de Session et retournés.
      return result.rows.map((row) => new Session(row));
    } catch (error) {
      //Si une erreur survient, une exception est levée avec un message d'erreur approprié.
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la récupération des sessions pour l'utilisateur ${userId}: ${error.message}`);
      } else {
        throw new Error(`Erreur inconnue lors de la récupération des sessions pour l'utilisateur ${userId}: ${JSON.stringify(error)}`);
      }
    }
  }

  //La méthode createSession insère une nouvelle session dans la base de données et retourne la session créée.
  async createSession(session: Session): Promise<Session> {
    try {
      ////La methode query du client est appelée pour executer la requete sql pour creer une session
      const result = await pool.query(
        `INSERT INTO sessions (utilisateur_id, token_hash, date_creation, date_expiration, statut)
         VALUES ($1, $2, NOW(), $3, $4) RETURNING *`,
        [session.utilisateurId, session.tokenHash, session.dateExpiration, session.statut]
      );
      return new Session(result.rows[0]);
    } catch (error) {
      //Si une erreur survient, une exception est levée avec un message d'erreur approprié.
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la création de la session: ${error.message}`);
      } else {
        throw new Error(`Erreur inconnue lors de la création de la session: ${JSON.stringify(error)}`);
      }
    }
  }

  //La méthode deleteSession supprime une session de la base de données par son ID.
  async deleteSession(sessionId: number): Promise<void> {
    try {
      //La methode query du client est appelée pour executer la requete sql pour supprimer une session
      await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
    } catch (error) {
      //Si une erreur survient, une exception est levée avec un message d'erreur approprié.
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la suppression de la session avec l'ID ${sessionId}: ${error.message}`);
      } else {
        throw new Error(`Erreur inconnue lors de la suppression de la session avec l'ID ${sessionId}: ${JSON.stringify(error)}`);
      }
    }
  }

  // Gestion des consentements
  //La méthode getConsentHistoryByUserId récupère l'historique des consentements d'un utilisateur par son ID 
  // et les retourne sous forme de tableau d'instances de HistoriqueConsentement.
  async getConsentHistoryByUserId(userId: number): Promise<HistoriqueConsentement[]> {
    try {
      ////La methode query du client est appelée pour executer la requete sql recuperer l historique de consentement d un utilisateur
      const result = await pool.query('SELECT * FROM historique_consentement WHERE utilisateur_id = $1', [userId]);
      // Les résultats de la requête sont mappés en instances de HistoriqueConsentement et retournés.
      return result.rows.map((row) => new HistoriqueConsentement(row));
    } catch (error) {
      //Si une erreur survient, une exception est levée avec un message d'erreur approprié.
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la récupération des consentements pour l'utilisateur ${userId}: ${error.message}`);
      } else {
        throw new Error(`Erreur inconnue lors de la récupération des consentements pour l'utilisateur ${userId}: ${JSON.stringify(error)}`);
      }
    }
  }

  //La méthode addConsentHistory insère un nouvel enregistrement dans l'historique des consentements.
  async addConsentHistory(history: HistoriqueConsentement): Promise<void> {
    try {
      //La methode query du client est appelée pour executer la requete sql pour ajouter le consentement au rgpd d un utilisateur
      await pool.query(
        `INSERT INTO historique_consentement (utilisateur_id, type_consentement, statut, date_modification, source, adresse_ip)
         VALUES ($1, $2, $3, NOW(), $4, $5)`,
        [history.utilisateurId, history.typeConsentement, history.statut, history.source, history.adresseIp]
      );
    } catch (error) {
      //Si une erreur survient, une exception est levée avec un message d'erreur approprié.
      if (error instanceof Error) {
        throw new Error(`Erreur lors de l'ajout d'un historique de consentement: ${error.message}`);
      } else {
        throw new Error(`Erreur inconnue lors de l'ajout d'un historique de consentement: ${JSON.stringify(error)}`);
      }
    }
  }

  // Gestion des logs administratifs
  //La méthode logAdminAction insère un nouvel enregistrement dans les logs administratifs.
  async logAdminAction(log: LogAdmin): Promise<void> {
    try {
      //La methode query du client est appelée pour executer la requete sql pour ajouter un log des actions d un admin
      await pool.query(
        `INSERT INTO logs_admin (admin_id, action, date_action) VALUES ($1, $2, NOW())`,
        [log.adminId, log.action]
      );
    } catch (error) {
      //Si une erreur survient, une exception est levée avec un message d'erreur approprié.
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la journalisation d'une action admin: ${error.message}`);
      } else {
        throw new Error(`Erreur inconnue lors de la journalisation d'une action admin: ${JSON.stringify(error)}`);
      }
    }
  }

  //La méthode getAdminLogs récupère tous les logs administratifs pour un administrateur par son ID 
  // et les retourne sous forme de tableau d'instances de LogAdmin.
  async getAdminLogs(adminId: number): Promise<LogAdmin[]> {
    try {
      //La methode query du client est appelée pour executer la requete sql pour recuperer les logs des actions d un admin
      const result = await pool.query('SELECT * FROM logs_admin WHERE admin_id = $1', [adminId]);
      // Les résultats de la requête sont mappés en instances de LogAdmin et retournés.
      return result.rows.map((row) => new LogAdmin(row));
    } catch (error) {
      //Si une erreur survient, une exception est levée avec un message d'erreur approprié.
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la récupération des logs admin pour l'ID ${adminId}: ${error.message}`);
      } else {
        throw new Error(`Erreur inconnue lors de la récupération des logs admin pour l'ID ${adminId}: ${JSON.stringify(error)}`);
      }
    }
  }
}
