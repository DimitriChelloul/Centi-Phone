import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Ce middleware est exporté pour être utilisé ailleurs dans l'application. Il est utilisé pour valider les données de création d'une commande.
export const validateCreateCommande = [
  // body("utilisateurId") est utilisée pour valider que le champ utilisateurId dans le corps de la requête est un entier.
  //  Si ce n'est pas le cas, un message d'erreur est renvoyé.
  body("utilisateurId").isInt().withMessage("L'ID utilisateur est requis et doit être un entier."),
  //body("details") est utilisée pour valider que le champ details dans le corps de la requête est un tableau contenant au moins un élément.
  body("details").isArray({ min: 1 }).withMessage("Les détails de la commande sont requis."),
  // body("email") est utilisée pour valider que le champ email dans le corps de la requête est une adresse e-mail valide
  body("email").isEmail().withMessage("Un e-mail valide est requis."),
  // Une fonction middleware est définie pour gérer les erreurs de validation.
  //  Elle prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs)
  (req: Request, res: Response, next: NextFunction) => {
    //validationResult(req) est utilisée pour obtenir les erreurs de validation
    const errors = validationResult(req);
    // Si des erreurs sont présentes, une réponse JSON avec les erreurs est renvoyée avec le statut 400 (Mauvaise requête)
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }
    // Sinon, la fonction next est appelée pour passer au middleware suivant.
    next();
  },
];

// Ce middleware est exporté pour être utilisé ailleurs dans l'application. Il est utilisé pour valider un ID de commande dans les paramètres de la requête.
export const validateCommandeId = [
  //param("commandeId") est utilisée pour valider que le paramètre commandeId dans la requête est un entier
  param("commandeId").isInt().withMessage("L'ID de la commande doit être un entier."),
  // Une fonction middleware est définie pour gérer les erreurs de validation.
  //  Elle prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs)
  (req: Request, res: Response, next: NextFunction) => {
    //validationResult(req) est utilisée pour obtenir les erreurs de validation
    const errors = validationResult(req);
    //Si des erreurs sont présentes, une réponse JSON avec les erreurs est renvoyée avec le statut 400
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }
    //Sinon, la fonction next est appelée pour passer au middleware suivant.
    next();
  },
];
