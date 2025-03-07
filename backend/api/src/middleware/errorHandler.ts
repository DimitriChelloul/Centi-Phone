import { Request, Response, NextFunction } from "express";
import { AppErrorGen } from "../../../domain/src/utils/AppErrorGen";

// Classe d'erreur personnalisée
//AppError est déclarée et exportée pour être utilisée ailleurs dans l'application. Elle étend la classe Error native de JavaScript.
export class AppError extends Error {
  // La propriété statusCode est déclarée comme publique et en lecture seule. Elle est utilisée pour stocker le code de statut HTTP de l'erreur.
  public readonly statusCode: number;

  // Le constructeur de la classe AppError prend deux paramètres : message (le message d'erreur) et statusCode (le code de statut HTTP).
  constructor(message: string, statusCode: number) {
    // Le constructeur de la classe Error est appelé avec le message d'erreur pour initialiser l'erreur.
    super(message);
    // La propriété statusCode est initialisée avec la valeur passée au constructeur.
    this.statusCode = statusCode;

    // Nécessaire pour que `instanceof` fonctionne correctement
    // La méthode Object.setPrototypeOf est utilisée pour configurer le prototype de l'instance de AppError 
    // afin que l'opérateur instanceof fonctionne correctement. Cela garantit que AppError est reconnu comme une instance de Error.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Middleware global pour gérer les erreurs
// Ce middleware prend quatre paramètres : err (l'erreur), req (la requête), res (la réponse), et next (la fonction de gestion des erreurs).
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

// Vérifiez si les en-têtes ont déjà été envoyés
if (res.headersSent) {
  return next(err);
}

  // L'erreur est loggée dans la console avec console.error. La propriété err.stack contient la trace de la pile de l'erreur, ce qui peut être utile pour le débogage.
  console.error(err.stack);

  // Si l'erreur est une instance de AppError, cela signifie que c'est une erreur personnalisée.
  if (err instanceof AppError) {
    //  Si l'erreur est une instance de AppError, une réponse JSON avec le message d'erreur et le code de statut HTTP est renvoyée.
    res.status(err.statusCode).json({ message: err.message });
  } else {
    // Une réponse JSON avec un message d'erreur générique et le code de statut HTTP 500 (Erreur interne du serveur) est renvoyée.
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

