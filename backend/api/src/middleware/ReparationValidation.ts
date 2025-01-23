import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Middleware  utilisé pour valider les données de création d'un rendez-vous (RDV).
export const validateCreateRdv = [
  //body("utilisateurId") est utilisée pour valider que le champ utilisateurId dans le corps de la requête est un entier
  body("utilisateurId").isInt().withMessage("L'ID utilisateur doit être un entier."),
  // body("email") est utilisée pour valider que le champ email dans le corps de la requête est une adresse email valide
  body("email").isEmail().withMessage("L'email est requis et doit être valide."),
  //body("dateRdv") est utilisée pour valider que le champ dateRdv dans le corps de la requête est une date valide au format ISO 8601
  body("dateRdv").isISO8601().withMessage("La date du RDV doit être valide."),
  // fonction middleware est définie pour gérer les erreurs de validation.
  //  Elle prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs
  (req: Request, res: Response, next: NextFunction) => {
    // validationResult(req) est utilisée pour obtenir les erreurs de validation
    const errors = validationResult(req);
    // Si des erreurs sont présentes, une réponse JSON avec les erreurs est renvoyée avec le statut 400
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }
    // Sinon, la fonction next est appelée pour passer au middleware suivant.
    next();
  },
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
   // fonction middleware est définie pour gérer les erreurs de validation.
  //  Elle prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs
  (req: Request, res: Response, next: NextFunction) => {
     // validationResult(req) est utilisée pour obtenir les erreurs de validation
    const errors = validationResult(req);
    // Si des erreurs sont présentes, une réponse JSON avec les erreurs est renvoyée avec le statut 400
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }
     // Sinon, la fonction next est appelée pour passer au middleware suivant.
    next();
  },
];

 // Middleware utilisé pour gérer les erreurs de validation.
 export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  // La fonction validationResult(req) est utilisée pour obtenir les erreurs de validation présentes dans la requête.
    const errors = validationResult(req);
    // Si des erreurs sont présentes, une réponse JSON avec les erreurs est renvoyée avec le statut 400
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }
    // Si aucune erreur n'est présente, la fonction next est appelée pour passer au middleware suivant.
    next();
  };
