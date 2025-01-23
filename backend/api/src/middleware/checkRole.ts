import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const checkRole = (requiredRole: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // Retourne immédiatement la réponse si le token est manquant
      res.status(401).json({ message: "Token manquant" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

      if (!decodedToken || decodedToken.role !== requiredRole) {
        // Retourne immédiatement la réponse si le rôle est insuffisant
        res.status(403).json({ message: "Accès refusé : rôle insuffisant" });
        return;
      }

      // Ajouter les informations de l'utilisateur décodées au `req` pour un usage futur
      (req as any).user = decodedToken;

      next(); // Poursuivre l'exécution si tout est valide
    } catch (error) {
      // Retourne immédiatement la réponse en cas d'erreur de vérification du token
      res.status(401).json({ message: "Token invalide" });
      return;
    }
  };
};
