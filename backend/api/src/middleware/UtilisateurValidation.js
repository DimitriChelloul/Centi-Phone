import { body, param } from "express-validator";
export const validateLogin = [
    body("email").isEmail().withMessage("L'email est invalide."),
    body("motDePasse")
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("Le mot de passe doit contenir au moins 6 caractères."),
];
// Middleware de validation pour l'enregistrement d'un utilisateur
export const validateRegister = [
    body("email").isEmail().withMessage("L'email est invalide."),
    body("nom").notEmpty().withMessage("Le nom est requis."),
    body("prenom").notEmpty().withMessage("Le prénom est requis."),
    body("motDePasse")
        .isLength({ min: 6 })
        .withMessage("Le mot de passe doit contenir au moins 6 caractères."),
];
export const validateDelete = [
    param("id").isInt().withMessage("L'ID doit être un nombre entier valide."),
];
