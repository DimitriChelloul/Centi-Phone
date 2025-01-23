import { container } from "tsyringe";
import { ReviewService } from "../../../bll/src/services/AvisService";
export class AvisController {
    constructor() {
        // Créer un avis
        this.createReview = async (req, res, next) => {
            try {
                const { utilisateurId, commentaire, note, produitId, type } = req.body;
                const avis = {
                    utilisateurId,
                    commentaire,
                    note,
                    produitAVendreId: type === "produit" ? produitId : undefined,
                    appareilReconditionneId: type === "appareil" ? produitId : undefined,
                };
                const newReview = await this.reviewService.createReview(utilisateurId, avis);
                res.status(201).json(newReview);
            }
            catch (error) {
                next(error);
            }
        };
        // Récupérer les avis pour un produit ou un appareil
        this.getReviewsByProductId = async (req, res, next) => {
            try {
                const productId = Number(req.params.productId);
                const type = req.query.type;
                const reviews = await this.reviewService.getReviewsByProductId(productId, type);
                res.status(200).json(reviews);
            }
            catch (error) {
                next(error);
            }
        };
        // Récupérer un avis par ID
        this.getReviewById = async (req, res, next) => {
            try {
                const reviewId = Number(req.params.reviewId);
                const review = await this.reviewService.getReviewById(reviewId);
                if (!review) {
                    res.status(404).json({ message: "Avis non trouvé." });
                }
                res.status(200).json(review);
            }
            catch (error) {
                next(error);
            }
        };
        // Supprimer un avis
        this.deleteReview = async (req, res, next) => {
            try {
                const reviewId = Number(req.params.reviewId);
                await this.reviewService.deleteReview(reviewId);
                res.status(200).json({ message: "Avis supprimé avec succès." });
            }
            catch (error) {
                next(error);
            }
        };
        this.reviewService = container.resolve(ReviewService);
    }
}
