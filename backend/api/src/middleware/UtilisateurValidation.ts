import { body, param } from "express-validator";


// Ce middleware est exporté pour être utilisé ailleurs dans l'application. Il est utilisé pour valider les données de connexion (login)
export const validateLogin = [
  // body("email") est utilisée pour valider que le champ email dans le corps de la requête est une adresse email valide
    body("email").isEmail().withMessage("L'email est invalide."),
    // body("motDePasse") est utilisée pour valider que le champ motDePasse dans le corps de la requête n'est pas vide et a une longueur minimale de 6 caractères
    body("motDePasse")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Le mot de passe doit contenir au moins 6 caractères."),
  ];

 //  Ce middleware est exporté pour être utilisé ailleurs dans l'application. Il est utilisé pour valider les données d'enregistrement (register) d'un utilisateur.
  export const validateRegister = [
    // body("email") est utilisée pour valider que le champ email dans le corps de la requête est une adresse email valide.
    body("email").isEmail().withMessage("L'email est invalide."),
    // body("nom") est utilisée pour valider que le champ nom dans le corps de la requête n'est pas vide
    body("nom").notEmpty().withMessage("Le nom est requis."),
    //body("prenom") est utilisée pour valider que le champ prenom dans le corps de la requête n'est pas vide.
    body("prenom").notEmpty().withMessage("Le prénom est requis."),
    // body("motDePasse") est utilisée pour valider que le champ motDePasse dans le corps de la requête a une longueur minimale de 6 caractères
    body("motDePasse")
      .isLength({ min: 6 })
      .withMessage("Le mot de passe doit contenir au moins 6 caractères."),
  ];

  //utilisé pour valider les données de suppression (delete) d'un utilisateur.
  export const validateDelete = [
    // param("id") est utilisée pour valider que le paramètre id dans la requête est un entier.
    param("id").isInt().withMessage("L'ID doit être un nombre entier valide."),
  ];