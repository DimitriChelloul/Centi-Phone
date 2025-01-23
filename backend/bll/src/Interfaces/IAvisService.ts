import { Avis } from '../../../domain/src/entities/avis';

export interface IReviewService {
  // Gestion des avis
  createReview(utilisateurId: number, avis: Avis): Promise<Avis>;
  getReviewsByProductId(productId: number, type?: "produit" | "appareil"): Promise<Avis[]>;
  getReviewById(reviewId: number): Promise<Avis | null>;
  deleteReview(reviewId: number): Promise<void>;
}
