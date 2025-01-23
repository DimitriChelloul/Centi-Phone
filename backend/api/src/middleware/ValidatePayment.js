import { body, validationResult } from "express-validator";
// Middleware de validation pour la création de paiement
export const validateCreatePayment = [
    body("commandeId").isInt().withMessage("commandeId doit être un entier."),
    body("amount").isFloat({ gt: 0 }).withMessage("amount doit être un nombre positif."),
    body("currency")
        .isString()
        .isLength({ min: 3, max: 3 })
        .withMessage("currency doit être un code de devise valide (ex: 'USD')."),
];
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    next();
};
// Middleware de validation pour la validation de paiement
export const validateValidatePayment = [
    body("commandeId").isInt().withMessage("commandeId doit être un entier."),
];
