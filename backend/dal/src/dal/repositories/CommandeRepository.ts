import { query, pool } from '../config/db'; // Connexion à la base de données
import { ICommandRepository } from '../Interfaces/ICommandeRepository';
import { Commande } from 'domain/src/entities/commandes';
import { CommandDetail } from 'domain/src/entities/details_commandes';
import { Livraison } from 'domain/src/entities/livraisons';
import { OptionsDeLivraison } from 'domain/src/entities/options_livraison';
import { inject, injectable } from "tsyringe";
import { Pool, PoolClient } from "pg";

// La classe CommandRepository est déclarée et exportée pour être utilisée ailleurs dans l'application.
//  Elle implémente l'interface ICommandRepository.
//  Le décorateur @injectable() est utilisé pour indiquer que cette classe peut être injectée comme dépendance.
@injectable()
export class CommandRepository implements ICommandRepository {

  // La propriété client est déclarée comme privée et de type PoolClient. Elle est utilisée pour gérer les connexions à la base de données.
  private client!: PoolClient;

  // Le constructeur prend un paramètre pool de type Pool. Le décorateur @inject("DatabasePool") est utilisé pour injecter une instance de Pool dans la propriété pool.
  constructor(@inject("DatabasePool") private pool: Pool) {}

  //Cette méthode est asynchrone et prend un paramètre optionnel client de type PoolClient. Elle retourne une promesse de type void.
  async initialize(client?: PoolClient): Promise<void> {
    //Si un PoolClient est fourni, il est assigné à la propriété client.
    if (client) {
      this.client = client; // Si un PoolClient est fourni (via UnitOfWork), on l'utilise
    } else {
      try {
        //Si aucun PoolClient n'est fourni, un nouveau client est obtenu du pool global en utilisant la méthode connect du pool
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
  // Gestion des commandes
  //Cette méthode est asynchrone et prend un paramètre command de type Commande. Elle retourne une promesse de type Commande.
  async createCommand(command: Commande): Promise<Commande> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL d'insertion dans la table commandes.
      //  Les valeurs des champs de la commande sont passées en paramètres.
      const result = await pool.query(
        `INSERT INTO commandes (utilisateur_id, total, date_commande) 
         VALUES ($1, $2, NOW()) RETURNING *`,
        [command.utilisateurId, command.total]
      );
      // Une nouvelle instance de Commande est créée avec les données retournées par la requête et est retournée
      return new Commande(result.rows[0]);
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif
      console.error('Error creating command:', error);
      throw new Error('Failed to create command.');
    }
  }

  // Cette méthode est asynchrone et prend un paramètre id (l'ID de la commande). Elle retourne une promesse de type Commande ou null
  async getCommandById(id: number): Promise<Commande | null> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table commandes pour récupérer la commande par son ID.
      const result = await pool.query('SELECT * FROM commandes WHERE id = $1', [id]);
      //Si une commande est trouvée, une nouvelle instance de Commande est créée avec les données retournées par la requête et est retournée. Sinon, null est retourné.
      return result.rows.length > 0 ? new Commande(result.rows[0]) : null;
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Error fetching command by ID:', error);
      throw new Error('Failed to retrieve command.');
    }
  }

  // Cette méthode est asynchrone et prend un paramètre userId (l'ID de l'utilisateur). Elle retourne une promesse de type tableau de Commande.
  async getCommandsByUserId(userId: number): Promise<Commande[]> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table commandes
      //  pour récupérer les commandes de l'utilisateur par son ID.
      const result = await pool.query('SELECT * FROM commandes WHERE utilisateur_id = $1', [userId]);
      // Les résultats de la requête sont mappés en instances de Commande et retournés.
      return result.rows.map((row: any) => new Commande(row));
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif
      console.error('Error fetching commands by user ID:', error);
      throw new Error('Failed to retrieve user commands.');
    }
  }

  //Cette méthode est asynchrone et prend un paramètre id (l'ID de la commande). Elle retourne une promesse de type void.
  async deleteCommand(id: number): Promise<void> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de suppression dans la table commandes pour supprimer la commande par son ID.
      await pool.query('DELETE FROM commandes WHERE id = $1', [id]);
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Error deleting command:', error);
      throw new Error('Failed to delete command.');
    }
  }

  // Gestion des détails de commande
  //Cette méthode est asynchrone et prend un paramètre commandId (l'ID de la commande). Elle retourne une promesse de type tableau de CommandDetail.
  async getCommandDetails(commandId: number): Promise<CommandDetail[]> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection
      //  dans la table details_commande pour récupérer les détails de la commande par son ID.
      const result = await pool.query('SELECT * FROM details_commande WHERE commande_id = $1', [commandId]);
      // Les résultats de la requête sont mappés en instances de CommandDetail et retournés.
      return result.rows.map((row: any) => new CommandDetail(row));
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Error fetching command details:', error);
      throw new Error('Failed to retrieve command details.');
    }
  }

  // Cette méthode est asynchrone et prend un paramètre detail de type CommandDetail. Elle retourne une promesse de type CommandDetail.
  async addCommandDetail(detail: CommandDetail): Promise<CommandDetail> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL d'insertion dans la table details_commande.
      //  Les valeurs des champs du détail de la commande sont passées en paramètres.
      const result = await pool.query(
        `INSERT INTO details_commande (commande_id, produit_a_vendre_id, appareil_reconditionne_id, quantite, prix_unitaire) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          detail.commandeId,
          detail.produitAVendreId,
          detail.appareilReconditionneId,
          detail.quantite,
          detail.prixUnitaire,
        ]
      );
      //Une nouvelle instance de CommandDetail est créée avec les données retournées par la requête et est retournée.
      return new CommandDetail(result.rows[0]);
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Error adding command detail:', error);
      throw new Error('Failed to add command detail.');
    }
  }

  // Gestion des livraisons
  // Cette méthode est asynchrone et prend un paramètre delivery de type Livraison. Elle retourne une promesse de type Livraison.
  async createLivraison(delivery: Livraison): Promise<Livraison> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL d'insertion dans la table livraisons.
      //  Les valeurs des champs de la livraison sont passées en paramètres.
      const result = await pool.query(
        `INSERT INTO livraisons (commande_id, option_livraison_id, adresse_livraison, date_livraison_prevue, statut) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          delivery.commandeId,
          delivery.optionLivraisonId,
          delivery.adresseLivraison,
          delivery.dateLivraisonPrevue,
          delivery.statut,
        ]
      );
      //Une nouvelle instance de Livraison est créée avec les données retournées par la requête et est retournée
      return new Livraison(result.rows[0]);
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Error creating delivery:', error);
      throw new Error('Failed to create delivery.');
    }
  }

  // Cette méthode est asynchrone et prend un paramètre commandId (l'ID de la commande). Elle retourne une promesse de type Livraison ou null.
  async getLivraisonByCommandId(commandId: number): Promise<Livraison | null> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table livraisons pour récupérer la livraison par l'ID de la commande.
      const result = await pool.query('SELECT * FROM livraisons WHERE commande_id = $1', [commandId]);
      // Si une livraison est trouvée, une nouvelle instance de Livraison est créée avec les données retournées par la requête et est retournée. Sinon, null est retourné.
      return result.rows.length > 0 ? new Livraison(result.rows[0]) : null;
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Error fetching delivery by command ID:', error);
      throw new Error('Failed to retrieve delivery.');
    }
  }

  // Cette méthode est asynchrone et ne prend aucun paramètre. Elle retourne une promesse de type tableau de OptionsDeLivraison
  async getAllDeliveryOptions(): Promise<OptionsDeLivraison[]> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table options_livraison pour récupérer toutes les options de livraison.
      const result = await pool.query('SELECT * FROM options_livraison');
      // Les résultats de la requête sont mappés en instances de OptionsDeLivraison et retournés.
      return result.rows.map((row: any) => new OptionsDeLivraison(row));
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Error fetching all delivery options:', error);
      throw new Error('Failed to retrieve delivery options.');
    }
  }

  // Cette méthode est asynchrone et prend deux paramètres :
  //  commandeId (l'ID de la commande) et statut (le nouveau statut de paiement). Elle retourne une promesse de type void.
  async updateStatutPaiement(commandeId: number, statut: string): Promise<void> {
   
    const query = `
      UPDATE commandes
      SET statut_paiement = $1
      WHERE id = $2;
    `;

     // La méthode query du client est utilisée pour exécuter une requête SQL
    //  de mise à jour dans la table commandes pour mettre à jour le statut de paiement de la commande par son ID.
    await pool.query(query, [statut, commandeId]);
  }
}