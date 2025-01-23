import { body, param, validationResult } from "express-validator";
// Middleware pour valider la création d'un avis
export const validateCreateReview = [
    body("utilisateurId").isInt().withMessage("L'ID utilisateur est requis et doit être un entier."),
    body("commentaire").isString().isLength({ min: 10 }).withMessage("Le commentaire doit avoir au moins 10 caractères."),
    body("note").isFloat({ min: 1, max: 5 }).withMessage("La note doit être comprise entre 1 et 5."),
    body("produitId").isInt().withMessage("L'ID du produit ou de l'appareil est requis."),
    body("type")
        .isIn(["produit", "appareil"])
        .withMessage("Le type doit être 'produit' ou 'appareil'."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
// Middleware pour valider un ID numérique
export const validateIdParam = [
    param("reviewId").isInt().withMessage("L'ID de l'avis doit être un entier."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
// Middleware pour gérer les erreurs de validation
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    next();
};
