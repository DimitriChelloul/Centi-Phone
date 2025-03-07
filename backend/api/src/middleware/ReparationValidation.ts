import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Middleware  utilisé pour valider les données de création d'un rendez-vous (RDV).
export const validateCreateRdv = [
  //body("utilisateurId") est utilisée pour valider que le champ utilisateurId dans le corps de la requête est un entier
  //body("utilisateurId").isInt().withMessage("L'ID utilisateur doit être un entier."),
  // body("email") est utilisée pour valider que le champ email dans le corps de la requête est une adresse email valide
  body("email").isEmail().withMessage("L'email est requis et doit être valide."),
  //body("dateRdv") est utilisée pour valider que le champ dateRdv dans le corps de la requête est une date valide au format ISO 8601
  body("dateRdv").isISO8601().withMessage("La date du RDV doit être valide."),

];

// Middleware utilisé pour valider les données de mise à jour du statut d'une réparation.
export const validateUpdateStatut = [
  // body("rendezVousId") est utilisée pour valider que le champ rendezVousId dans le corps de la requête est un entier
  body("rendezVousId").isInt().withMessage("L'ID du rendez-vous doit être un entier."),
  // body("statut") est utilisée pour valider que le champ statut dans le corps de la requête est soit "en cours" soit "terminé"
  body("statut").isIn(["en cours", "termine"]).withMessage("Le statut doit être 'en cours' ou 'termine'."),
  // body("clientEmail") est utilisée pour valider que le champ clientEmail dans le corps de la requête est une adresse email valide.
  body("clientEmail").isEmail().withMessage("L'email client est requis et doit être valide."),
  //body("clientName") est utilisée pour valider que le champ clientName dans le corps de la requête est une chaîne de caractères
  body("clientName").isString().withMessage("Le nom du client est requis."),
 
];

 // Middleware utilisé pour gérer les erreurs de validation.
 export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return; // Ajout d'un `return` pour éviter de passer à `next()` après avoir envoyé une réponse
  }
  next(); // Passe au middleware suivant si aucune erreur n'est trouvée
};

