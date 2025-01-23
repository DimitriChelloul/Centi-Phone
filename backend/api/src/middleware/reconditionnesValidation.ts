import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateRefurbishedDevice = [
  // Validation du champ "idMarque"
  body("idMarque")
    .notEmpty().withMessage("Le champ 'idMarque' est obligatoire.")
    .isInt().withMessage("Le champ 'idMarque' doit être un entier."),

  // Validation du champ "idModele"
  body("idModele")
    .notEmpty().withMessage("Le champ 'idModele' est obligatoire.")
    .isInt().withMessage("Le champ 'idModele' doit être un entier."),

  // Validation du champ "description"
  body("description")
    .optional()
    .isString().withMessage("Le champ 'description' doit être une chaîne de caractères.")
    .isLength({ max: 500 }).withMessage("Le champ 'description' ne doit pas dépasser 500 caractères."),

  // Validation du champ "prix"
  body("prix")
    .notEmpty().withMessage("Le champ 'prix' est obligatoire.")
    .isFloat({ gt: 0 }).withMessage("Le champ 'prix' doit être un nombre positif."),

  // Validation du champ "stock"
  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("Le champ 'stock' doit être un entier positif."),

  // Validation du champ "garantieMois"
  body("garantieMois")
    .optional()
    .isInt({ min: 0 }).withMessage("Le champ 'garantieMois' doit être un entier positif."),

  // Validation du champ "dateReconditionnement"
  body("dateReconditionnement")
    .optional()
    .isISO8601().withMessage("Le champ 'dateReconditionnement' doit être une date valide (format ISO 8601)."),
];
