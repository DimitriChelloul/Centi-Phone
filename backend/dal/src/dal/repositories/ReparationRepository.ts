import { inject, injectable } from "tsyringe";
import { Pool, PoolClient } from "pg";
import { IRepairRepository } from "../../dal/Interfaces/IReparationRepository";
import { Rdv } from "../../../../domain/src/entities/rdv";
import { SuiviReparation } from "../../../../domain/src/entities/suivi_reparation";
import { Devis } from "../../../../domain/src/entities/devis";
import { query, pool } from '../config/db'; // Connexion à la base de données

// Enum pour les statuts
export enum RdvStatus {
  EnAttente = "en attente",
  EnCours = "en cours",
  Termine = "termine",
}

export enum DevisStatus {
  EnAttente = "en attente",
  Accepte = "accepte",
  Refuse = "refuse",
}

// La classe RepairRepository est déclarée et exportée pour être utilisée ailleurs dans l'application. 
// Elle implémente l'interface IRepairRepository et utilise l'injection de dépendances
@injectable()
export class RepairRepository implements IRepairRepository {

  // La propriété client est déclarée comme privée et de type PoolClient. Elle est utilisée pour gérer les connexions à la base de données.
  private client!: PoolClient;

  //Le constructeur prend un paramètre pool de type Pool.
  //  Le décorateur @inject("DatabasePool") est utilisé pour injecter une instance de Pool dans la propriété pool.
  constructor(@inject("DatabasePool") private pool: Pool) {}

  // Cette méthode est asynchrone et prend un paramètre optionnel client de type PoolClient. Elle retourne une promesse de type void
  async initialize(client?: PoolClient): Promise<void> {

    // Si un PoolClient est fourni (via UnitOfWork), on l'utilise
    if (client) {
      this.client = client; 
    } else {
      //  Si aucun PoolClient n'est fourni, un nouveau client est obtenu du pool global en utilisant la méthode connect du pool
      try {
        this.client = await this.pool.connect();
      } catch (err) {
        // Les erreurs éventuelles sont capturées et une nouvelle erreur est levée avec un message descriptif.
        if (err instanceof Error) {
          throw new Error(`Error connecting to the database: ${err.message}`);
        } else {
          throw new Error("An unknown error occurred while connecting to the database.");
        }
      }
    }
  }

  // Gestion des rendez-vous
  //Cette méthode est asynchrone et prend un paramètre appointment de type Rdv. Elle retourne une promesse de type Rdv.
  async createRdv(appointment: Rdv): Promise<Rdv> {
    try {
        if (!appointment.dateRendezVous) {
            throw new Error("La date du rendez-vous est manquante.");
        }

        // Vérifie si la date est bien un objet `Date`
        let dateRendezVous;
        if (typeof appointment.dateRendezVous === "string") {
            dateRendezVous = new Date(appointment.dateRendezVous);
        } else {
            dateRendezVous = appointment.dateRendezVous;
        }

        if (isNaN(dateRendezVous.getTime())) {
            throw new Error("Format de date invalide.");
        }
        console.log("🔹 [DEBUG DAL] utilisateurId avant insertion :", appointment.utilisateurId);
        // Convertit au format PostgreSQL `YYYY-MM-DD HH:mm:ss`
        const dateFormatee = dateRendezVous.toISOString().slice(0, 19).replace("T", " ");

        console.log("🔹 [DEBUG] Date formatée avant insertion :", dateFormatee);

        console.log("🔹 [DEBUG] Données envoyées à PostgreSQL :", {
          utilisateurId: appointment.utilisateurId,
          problemeDescription: appointment.problemeDescription,
          dateRendezVous: dateFormatee,
          statut: appointment.statut || "en attente"
      });

        const result = await pool.query(
            `INSERT INTO rendez_vous (utilisateur_id, probleme_description, date_rendez_vous, statut)
             VALUES ($1, $2, $3::timestamp, $4) RETURNING *`,
            [
                appointment.utilisateurId,
                appointment.problemeDescription || null,
                dateFormatee,
                appointment.statut || "en attente",
            ]
        );

        return new Rdv(result.rows[0]);
    } catch (error) {
        console.error("❌ [ERROR] Erreur lors de la création du rendez-vous:", error);
        throw new Error("Erreur lors de la création du rendez-vous.");
    }
}

  
async getAllRdvs(): Promise<{ rdv: Rdv, utilisateur: any }[]> {
  const result = await query(
    `SELECT r.*, u.nom, u.prenom, u.email, u.telephone
     FROM rdv r
     JOIN utilisateurs u ON r.utilisateur_id = u.id`
  );

  return result.map((row: any) => ({
    rdv: new Rdv(row),
    utilisateur: {
      id: row.utilisateur_id,
      nom: row.nom,
      prenom: row.prenom,
      email: row.email,
      telephone: row.telephone
    }
  }));
}

async getRdvDetailsById(id: number): Promise<{ rdv: Rdv, utilisateur: any } | null> {
  const result = await query(
    `SELECT r.*, u.nom, u.prenom, u.email, u.telephone
     FROM rdv r
     JOIN utilisateurs u ON r.utilisateur_id = u.id
     WHERE r.id = $1`, 
    [id]
  );

  if (result.length === 0) return null;

  return {
    rdv: new Rdv(result[0]),
    utilisateur: {
      id: result[0].utilisateur_id,
      nom: result[0].nom,
      prenom: result[0].prenom,
      email: result[0].email,
      telephone: result[0].telephone
    }
  };
}

async getRdvByDate(date: Date): Promise<Rdv[]> {
  const res = await this.pool.query(
    `SELECT * FROM rendez_vous WHERE date_rendez_vous::date = $1`,
    [date.toISOString().split('T')[0]]
  );
  return res.rows.map(row => new Rdv(row));
}

async updateRdvStatus(id: number, statut: 'en attente' | 'en cours' | 'termine'): Promise<void> {
  await query(`UPDATE rdv SET statut = $1 WHERE id = $2`, [statut, id]);
}

async isSlotAvailable(date: Date, dureeMinutes: number): Promise<boolean> {
  const debutRdv = date;
  const finRdv = new Date(debutRdv.getTime() + dureeMinutes * 60000);

  const res = await this.pool.query(
    `SELECT COUNT(*) FROM rendez_vous 
     WHERE (date_rendez_vous >= $1 AND date_rendez_vous < $2) 
     OR (date_rendez_vous + INTERVAL '20 minutes' > $1 AND date_rendez_vous <= $2)`,
    [debutRdv.toISOString(), finRdv.toISOString()]
  );

  return parseInt(res.rows[0].count, 10) === 0;
}


  
  

  // Cette méthode est asynchrone et prend un paramètre userId (l'ID de l'utilisateur). Elle retourne une promesse de type tableau de Rdv.
  async getRdvByUserId(userId: number): Promise<Rdv[]> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table rendez_vous 
      // pour récupérer les rendez-vous de l'utilisateur par son ID.
      const result = await pool.query(
        "SELECT * FROM rendez_vous WHERE utilisateur_id = $1",
        [userId]
      );
      //Les résultats de la requête sont mappés en instances de Rdv et retournés.
      return result.rows.map((row: any) => new Rdv(row));
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error(
        `Erreur lors de la récupération des rendez-vous pour l'utilisateur ${userId}:`,
        error
      );
      throw new Error("Erreur lors de la récupération des rendez-vous.");
    }
  }

  //Cette méthode est asynchrone et prend un paramètre id (l'ID du rendez-vous). Elle retourne une promesse de type Rdv ou null.
  async getRdvById(id: number): Promise<Rdv | null> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table rendez_vous pour récupérer le rendez-vous par son ID.
      const result = await pool.query(
        "SELECT * FROM rendez_vous WHERE id = $1",
        [id]
      );
      // Si des résultats sont trouvés, une nouvelle instance de Rdv est créée avec les données retournées par la requête et est retournée.Sinon, null est retourné.
      return result.rows.length > 0 ? new Rdv(result.rows[0]) : null;
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif
      console.error(`Erreur lors de la récupération du rendez-vous ${id}:`, error);
      throw new Error("Erreur lors de la récupération du rendez-vous.");
    }
  }

  // Cette méthode est asynchrone et prend un paramètre id (l'ID du rendez-vous). Elle retourne une promesse de type void.
  async deleteRdv(id: number): Promise<void> {
    try {
      //La méthode query du client est utilisée pour exécuter une requête SQL de suppression dans la table rendez_vous pour supprimer le rendez-vous par son ID.
      const result = await pool.query("DELETE FROM rendez_vous WHERE id = $1", [id]);
      //Si aucun rendez-vous n'est trouvé, une erreur est levée avec un message descriptif.
      if (result.rowCount === 0) {
        throw new Error(`Aucun rendez-vous trouvé avec l'ID ${id}`);
      }
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error(`Erreur lors de la suppression du rendez-vous ${id}:`, error);
      throw new Error("Erreur lors de la suppression du rendez-vous.");
    }
  }

  // Gestion des suivis de réparation
  // Cette méthode est asynchrone et prend un paramètre appointmentId (l'ID du rendez-vous). Elle retourne une promesse de type tableau de SuiviReparation.
  async getRSuiviReparationByAppointmentId(
    appointmentId: number
  ): Promise<SuiviReparation[]> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection
      //  dans la table suivis_reparation pour récupérer les suivis de réparation par l'ID du rendez-vous.
      const result = await pool.query(
        "SELECT * FROM suivis_reparation WHERE rendez_vous_id = $1",
        [appointmentId]
      );
      //Les résultats de la requête sont mappés en instances de SuiviReparation et retournés
      return result.rows.map((row: any) => new SuiviReparation(row));
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error(
        `Erreur lors de la récupération des suivis de réparation pour le rendez-vous ${appointmentId}:`,
        error
      );
      throw new Error("Erreur lors de la récupération des suivis de réparation.");
    }
  }

  // Cette méthode est asynchrone et prend un paramètre tracking de type SuiviReparation. Elle retourne une promesse de type void.
  async addSuiviReparation(tracking: SuiviReparation): Promise<void> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL d'insertion 
      // dans la table suivis_reparation. Les valeurs des champs du suivi de réparation sont passées en paramètres.
      await pool.query(
        `INSERT INTO suivis_reparation (rendez_vous_id, statut, date_statut)
         VALUES ($1, $2, NOW()) RETURNING *`,
        [tracking.rendezVousId, tracking.statut]
      );
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error(
        `Erreur lors de l'ajout d'un suivi de réparation pour le rendez-vous ${tracking.rendezVousId}:`,
        error
      );
      throw new Error("Erreur lors de l'ajout d'un suivi de réparation.");
    }
  }

  // Gestion des devis
  //Cette méthode est asynchrone et prend un paramètre devis de type Devis. Elle retourne une promesse de type Devis.
  async createDevis(devis: Devis): Promise<Devis> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL d'insertion dans la table devis.
      //  Les valeurs des champs du devis sont passées en paramètres.
      const result = await pool.query(
        `INSERT INTO devis (utilisateur_id, id_modele, id_reparation_disponible, description_probleme, estimation_prix, statut, date_creation)
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
        [
          devis.utilisateurId,
          devis.idModele || null,
          devis.idReparationDisponible || null,
          devis.descriptionProbleme || null,
          devis.estimationPrix || null,
          devis.statut || DevisStatus.EnAttente,
        ]
      );

      //Une nouvelle instance de Devis est créée avec les données retournées par la requête et est retournée.
      return new Devis(result.rows[0]);
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif
      console.error("Erreur lors de la création du devis:", error);
      throw new Error("Erreur lors de la création du devis.");
    }
  }

  // Cette méthode est asynchrone et prend un paramètre userId (l'ID de l'utilisateur). Elle retourne une promesse de type tableau de Devis.
  async getDevisByUserId(userId: number): Promise<Devis[]> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table devis pour récupérer les devis de l'utilisateur par son ID.
      const result = await pool.query("SELECT * FROM devis WHERE utilisateur_id = $1", [
        userId,
      ]);
      //Les résultats de la requête sont mappés en instances de Devis et retournés.
      return result.rows.map((row: any) => new Devis(row));
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif
      console.error(
        `Erreur lors de la récupération des devis pour l'utilisateur ${userId}:`,
        error
      );
      throw new Error("Erreur lors de la récupération des devis.");
    }
  }

  // Cette méthode est asynchrone et prend un paramètre id (l'ID du devis). Elle retourne une promesse de type Devis ou null
  async getDevisById(id: number): Promise<Devis | null> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table devis pour récupérer le devis par son ID.
      const result = await pool.query("SELECT * FROM devis WHERE id = $1", [id]);
      // Si des résultats sont trouvés, une nouvelle instance de Devis est créée avec les données retournées par la requête et est retournée. Sinon, null est retourné.
      return result.rows.length > 0 ? new Devis(result.rows[0]) : null;
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error(`Erreur lors de la récupération du devis ${id}:`, error);
      throw new Error("Erreur lors de la récupération du devis.");
    }
  }

  //Cette méthode est asynchrone et prend deux paramètres : devisId (l'ID du devis) et statut (le nouveau statut du devis). Elle retourne une promesse de type Devis.
  async updateDevis(devis: Devis): Promise<Devis> {
    try {
      //La méthode query du client est utilisée pour exécuter une requête SQL de mise à jour dans la table devis pour mettre à jour le statut du devis par son ID.
      const result = await pool.query(
        `UPDATE devis
         SET id_modele = $1, id_reparation_disponible = $2, description_probleme = $3, estimation_prix = $4, statut = $5
         WHERE id = $6 RETURNING *`,
        [
          devis.idModele || null,
          devis.idReparationDisponible || null,
          devis.descriptionProbleme || null,
          devis.estimationPrix || null,
          devis.statut || DevisStatus.EnAttente,
          devis.id,
        ]
      );
      // Une nouvelle instance de Devis est créée avec les données retournées par la requête et est retournée.
      return new Devis(result.rows[0]);
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error(`Erreur lors de la mise à jour du devis ${devis.id}:`, error);
      throw new Error("Erreur lors de la mise à jour du devis.");
    }
  }
}
