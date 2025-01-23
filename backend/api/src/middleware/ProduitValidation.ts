import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

//  Ce middleware est exporté pour être utilisé ailleurs dans l'application. Il est utilisé pour valider les champs d'un produit.
export const validateProduct = [
  // body("nom") est utilisée pour valider que le champ nom dans le corps de la requête est une chaîne de caractères
    body("nom").isString().withMessage("Le nom du produit est requis."),
    // body("prix") est utilisée pour valider que le champ prix dans le corps de la requête est un nombre flottant supérieur à 0
    body("prix").isFloat({ gt: 0 }).withMessage("Le prix doit être un nombre positif."),
    // body("stock") est utilisée pour valider que le champ stock dans le corps de la requête est un entier supérieur à 0.
    body("stock").isInt({ gt: 0 }).withMessage("Le stock doit être un entier positif."),
  ];
  
  //  Ce middleware est exporté pour être utilisé ailleurs dans l'application. Il est utilisé pour valider les champs de mise à jour du stock.
  export const validateStockUpdate = [
    // body("productId") est utilisée pour valider que le champ productId dans le corps de la requête est un entier
    body("productId").isInt().withMessage("L'ID du produit doit être un entier."),
    //body("quantityChange") est utilisée pour valider que le champ quantityChange dans le corps de la requête est un entier
    body("quantityChange")
      .isInt()
      .withMessage("La modification de stock doit être un entier."),
  ];
  
  //  Ce middleware est exporté pour être utilisé ailleurs dans l'application. Il est utilisé pour gérer les erreurs de validation.
  export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    // validationResult(req) est utilisée pour obtenir les erreurs de validation présentes dans la requête.
    const errors = validationResult(req);
    // Si des erreurs sont présentes,
    if (!errors.isEmpty()) {
      //une réponse JSON avec les erreurs est renvoyée avec le statut 400
       res.status(400).json({ errors: errors.array() });
    }
    // Si aucune erreur n'est présente, la fonction next est appelée pour passer au middleware suivant.
    next();
  };
