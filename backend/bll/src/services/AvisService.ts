import { injectable, inject } from "tsyringe";
import { IReviewRepository } from "../../../dal/src/dal/Interfaces/IAvisRepository";
import { IReviewService } from "../Interfaces/IAvisService";
import { Avis } from'../../../domain/src/entities/avis';
import { IUnitOfWork } from "../../../dal/src/dal/Interfaces/IUnitOfWork"


// classe ReviewService implémente l'interface IReviewService. Le décorateur @injectable() est utilisé pour indiquer que cette classe peut être injectée comme dépendance.
@injectable()
export class ReviewService implements IReviewService {
  // Le constructeur prend un paramètre reviewRepo de type IReviewRepository.
  //  Le décorateur @inject("IReviewRepository") est utilisé pour injecter une instance de IReviewRepository dans la propriété reviewRepo.
  constructor(@inject("IReviewRepository") private reviewRepo: IReviewRepository) {}

  // Cette méthode est asynchrone et prend deux paramètres : utilisateurId (l'ID de l'utilisateur) et avis (l'objet avis). Elle retourne une promesse de type Avis.
  async createReview(utilisateurId: number, avis: Avis): Promise<Avis> {
    // L'ID de l'utilisateur est assigné à la propriété utilisateurId de l'objet avis.
    avis.utilisateurId = utilisateurId;
    // La date actuelle est assignée à la propriété dateCreation de l'objet avis.
    avis.dateCreation = new Date();
    // La méthode createReview du repository reviewRepo est appelée pour créer un nouvel avis. Le résultat est retourné.
    return this.reviewRepo.createReview(avis);
  }

  // Cette méthode est asynchrone et prend deux paramètres :
  //  productId (l'ID du produit) et type (le type de produit, qui peut être 'produit' ou 'appareil').
  //  Elle retourne une promesse de type tableau d'Avis.
  async getReviewsByProductId(productId: number, type?: 'produit' | 'appareil'): Promise<Avis[]> {
    // La méthode getReviewsByProductId du repository reviewRepo est appelée pour récupérer les avis d'un produit. Le résultat est retourné.
    return this.reviewRepo.getReviewsByProductId(productId, type);
}

// Cette méthode est asynchrone et prend un paramètre : reviewId (l'ID de l'avis). Elle retourne une promesse de type Avis ou null.
  async getReviewById(reviewId: number): Promise<Avis | null> {
    // La méthode getReviewById du repository reviewRepo est appelée pour récupérer un avis par son ID. Le résultat est retourné.
    return this.reviewRepo.getReviewById(reviewId);
  }

  // Cette méthode est asynchrone et prend un paramètre : reviewId (l'ID de l'avis). Elle retourne une promesse de type void.
  async deleteReview(reviewId: number): Promise<void> {
    // La méthode deleteReview du repository reviewRepo est appelée pour supprimer un avis par son ID. L'opération est attendue avec await.
    await this.reviewRepo.deleteReview(reviewId);
  }
}
