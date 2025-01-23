import { body, validationResult } from "express-validator";
// Middleware pour valider la création d'un RDV
export const validateCreateRdv = [
    body("utilisateurId").isInt().withMessage("L'ID utilisateur doit être un entier."),
    body("email").isEmail().withMessage("L'email est requis et doit être valide."),
    body("dateRdv").isISO8601().withMessage("La date du RDV doit être valide."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
// Middleware pour mettre à jour le statut d'une réparation
export const validateUpdateStatut = [
    body("rendezVousId").isInt().withMessage("L'ID du rendez-vous doit être un entier."),
    body("statut").isIn(["en cours", "termine"]).withMessage("Le statut doit être 'en cours' ou 'termine'."),
    body("clientEmail").isEmail().withMessage("L'email client est requis et doit être valide."),
    body("clientName").isString().withMessage("Le nom du client est requis."),
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
