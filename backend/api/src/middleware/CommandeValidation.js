import { body, param, validationResult } from "express-validator";
export const validateCreateCommande = [
    body("utilisateurId").isInt().withMessage("L'ID utilisateur est requis et doit être un entier."),
    body("details").isArray({ min: 1 }).withMessage("Les détails de la commande sont requis."),
    body("email").isEmail().withMessage("Un e-mail valide est requis."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
export const validateCommandeId = [
    param("commandeId").isInt().withMessage("L'ID de la commande doit être un entier."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
