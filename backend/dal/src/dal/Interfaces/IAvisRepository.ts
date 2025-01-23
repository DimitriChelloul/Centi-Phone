import { PoolClient } from 'pg';
import { Avis } from '../../../../domain/src/entities/avis';

export interface IReviewRepository {
  initialize(client: PoolClient): unknown;
  // Gestion des avis
  createReview(avis: Avis): Promise<Avis>;
  getReviewsByProductId(productId: number, type?: "produit" | "appareil"): Promise<Avis[]>;
  getReviewById(id: number): Promise<Avis | null>;
  deleteReview(id: number): Promise<void>;
}
