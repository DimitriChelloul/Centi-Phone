import { body, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Ce middleware est exporté pour être utilisé ailleurs dans l'application. Il est utilisé pour valider les données de création d'un avis.
export const validateCreateReview = [
  //body("utilisateurId") est utilisée pour valider que le champ utilisateurId dans le corps de la requête est un entier
  body("utilisateurId").isInt().withMessage("L'ID utilisateur est requis et doit être un entier."),
  //body("commentaire") est utilisée pour valider que le champ commentaire dans le corps de la requête est une chaîne de caractères d'au moins 10 caractères de long.
  body("commentaire").isString().isLength({ min: 10 }).withMessage("Le commentaire doit avoir au moins 10 caractères."),
  //body("note") est utilisée pour valider que le champ note dans le corps de la requête est un nombre flottant compris entre 1 et 5.
  body("note").isFloat({ min: 1, max: 5 }).withMessage("La note doit être comprise entre 1 et 5."),
  //body("produitId") est utilisée pour valider que le champ produitId dans le corps de la requête est un entier
  body("produitId").isInt().withMessage("L'ID du produit ou de l'appareil est requis."),
  // body("type") est utilisée pour valider que le champ type dans le corps de la requête est soit "produit" soit "appareil".
  body("type")
    .isIn(["produit", "appareil"])
    .withMessage("Le type doit être 'produit' ou 'appareil'."),
    //Une fonction middleware est définie pour gérer les erreurs de validation.
    //  Elle prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs)
  (req: Request, res: Response, next: NextFunction) => {
    //validationResult(req) est utilisée pour obtenir les erreurs de validation
    const errors = validationResult(req);
    // Si des erreurs sont présentes, une réponse JSON avec les erreurs est renvoyée avec le statut 400 (Mauvaise requête)
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }
    //Sinon, la fonction next est appelée pour passer au middleware suivant.
    next();
  },
];

// Ce middleware est exporté pour être utilisé ailleurs dans l'application. Il est utilisé pour valider un ID numérique dans les paramètres de la requête.
export const validateIdParam = [
  // param("reviewId") est utilisée pour valider que le paramètre reviewId dans la requête est un entier. Si ce n'est pas le cas, un message d'erreur est renvoyé.
  param("reviewId").isInt().withMessage("L'ID de l'avis doit être un entier."),
  // Une fonction middleware est définie pour gérer les erreurs de validation.
  //  Elle prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs)
  (req: Request, res: Response, next: NextFunction) => {
    //validationResult(req) est utilisée pour obtenir les erreurs de validation
    const errors = validationResult(req);
    //Si des erreurs sont présentes, une réponse JSON avec les erreurs est renvoyée avec le statut 400 (Mauvaise requête).
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }
    //Sinon, la fonction next est appelée pour passer au middleware suivant.
    next();
  },
];

  //  Ce middleware est exporté pour être utilisé ailleurs dans l'application. Il est utilisé pour gérer les erreurs de validation.
  export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    // validationResult(req) est utilisée pour obtenir les erreurs de validation présentes dans la requête.
    const errors = validationResult(req);
    // Si des erreurs sont présentes, une réponse JSON avec les erreurs est renvoyée avec le statut 400 (Mauvaise requête).
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }
    //Si aucune erreur n'est présente, la fonction next est appelée pour passer au middleware suivant.
    next();
  };
