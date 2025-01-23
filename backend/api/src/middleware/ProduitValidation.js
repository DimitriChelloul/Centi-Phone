import { body, validationResult } from "express-validator";
// Middleware pour valider les champs d'un produit
export const validateProduct = [
    body("nom").isString().withMessage("Le nom du produit est requis."),
    body("prix").isFloat({ gt: 0 }).withMessage("Le prix doit être un nombre positif."),
    body("stock").isInt({ gt: 0 }).withMessage("Le stock doit être un entier positif."),
];
// Middleware pour valider la mise à jour du stock
export const validateStockUpdate = [
    body("productId").isInt().withMessage("L'ID du produit doit être un entier."),
    body("quantityChange")
        .isInt()
        .withMessage("La modification de stock doit être un entier."),
];
// Middleware pour gérer les erreurs de validation
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    next();
};
