import { query, pool } from '../config/db'; // Connexion à la base de données
import { IReviewRepository } from '../Interfaces/IAvisRepository';
import { Avis } from '../../../../domain/src/entities/avis';
import { inject, injectable } from "tsyringe";
import { Pool, PoolClient } from "pg";

// La classe ReviewRepository est déclarée et exportée pour être utilisée ailleurs dans l'application.
//  Elle implémente l'interface IReviewRepository.
//  Le décorateur @injectable() est utilisé pour indiquer que cette classe peut être injectée comme dépendance.
@injectable()
export class ReviewRepository implements IReviewRepository {

// La propriété client est déclarée comme privée et de type PoolClient. Elle est utilisée pour gérer les connexions à la base de données.
  private client!: PoolClient;

  // Le constructeur prend un paramètre pool de type Pool.
  //  Le décorateur @inject("DatabasePool") est utilisé pour injecter une instance de Pool dans la propriété pool.
  constructor(@inject("DatabasePool") private pool: Pool) {}

  // Cette méthode est asynchrone et prend un paramètre optionnel client de type PoolClient. Elle retourne une promesse de type void.
  async initialize(client?: PoolClient): Promise<void> {

    // Si un PoolClient est fourni, il est assigné à la propriété client.
    if (client) {
      this.client = client; // Si un PoolClient est fourni (via UnitOfWork), on l'utilise
    } else {
      //  Si aucun PoolClient n'est fourni, un nouveau client est obtenu du pool global en utilisant la méthode connect du pool
      try {
        this.client = await this.pool.connect();
      } catch (err) {
        //Les erreurs éventuelles sont capturées et une nouvelle erreur est levée avec un message descriptif
        if (err instanceof Error) {
          throw new Error(`Error connecting to the database: ${err.message}`);
        } else {
          throw new Error("An unknown error occurred while connecting to the database.");
        }
      }
    }
  }

  // Création d'un avis
  //Cette méthode est asynchrone et prend un paramètre avis de type Avis. Elle retourne une promesse de type Avis.
  async createReview(avis: Avis): Promise<Avis> {
    // La méthode query du client est utilisée pour exécuter une requête SQL d'insertion dans la table avis. Les valeurs des champs de l'avis sont passées en paramètres.
    const result = await this.client.query(
      `INSERT INTO avis (utilisateur_id, produit_a_vendre_id, appareil_reconditionne_id, commentaire, note, date_creation)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [
        avis.utilisateurId,
        avis.produitAVendreId || null, // Utilisation des champs distincts
        avis.appareilReconditionneId || null,
        avis.commentaire,
        avis.note,
      ]
    );
    //Une nouvelle instance de Avis est créée avec les données retournées par la requête et est retournée
    return new Avis(result.rows[0]);
  }

  // Récupération des avis pour un produit spécifique
  // Cette méthode est asynchrone et prend deux paramètres :
  //  productId (l'ID du produit) et type (le type de produit, qui peut être "produit" ou "appareil").
  //  Elle retourne une promesse de type tableau de Avis.
  async getReviewsByProductId(productId: number, type?: "produit" | "appareil"): Promise<Avis[]> {
    // La colonne à utiliser dans la requête SQL est déterminée en fonction du type de produit.
    const column = type === "produit" ? "produit_a_vendre_id" : "appareil_reconditionne_id";
    //La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table avis
    const result = await this.client.query(
      `SELECT * FROM avis WHERE ${column} = $1`,
      [productId]
    );
    //  Les résultats de la requête sont mappés en instances de Avis et retournés
    return result.rows.map((row: any) => new Avis(row));
  }

  // Récupération d'un avis spécifique
  // Cette méthode est asynchrone et prend un paramètre id (l'ID de l'avis). Elle retourne une promesse de type Avis ou null
  async getReviewById(id: number): Promise<Avis | null> {
    // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table avis pour récupérer l'avis par son ID.
    const result = await this.client.query('SELECT * FROM avis WHERE id = $1', [id]);
    // Si un avis est trouvé, une nouvelle instance de Avis est créée avec les données retournées par la requête et est retournée. Sinon, null est retourné.
    return result.rows.length > 0 ? new Avis(result.rows[0]) : null;
  }

  // Suppression d'un avis
  //Cette méthode est asynchrone et prend un paramètre id (l'ID de l'avis). Elle retourne une promesse de type void.
  async deleteReview(id: number): Promise<void> {
    //La méthode query du client est utilisée pour exécuter une requête SQL de suppression dans la table avis pour supprimer l'avis par son ID.
    await this.client.query('DELETE FROM avis WHERE id = $1', [id]);
  }
}
