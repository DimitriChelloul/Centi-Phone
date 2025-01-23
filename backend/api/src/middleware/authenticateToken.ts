import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/types"; // Chemin vers le fichier contenant l'interface JwtPayload
import { Utilisateur } from "../../../domain/src/entities/Utilisateurs"; // Chemin vers l'entité Utilisateur


//Déclaration du middleware authenticateToken : Ce middleware est exporté pour être utilisé ailleurs dans l'application.
//  Il prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs).
export const authenticateToken = (req: Request, res: Response, next: NextFunction): any => {
  // L'en-tête Authorization est extrait des en-têtes de la requête. Cet en-tête contient généralement le token JWT.
  const authHeader = req.headers["authorization"];
  //Le token JWT est extrait de l'en-tête Authorization.
  //  L'en-tête est généralement de la forme Bearer <token>, donc le token est extrait en divisant la chaîne et en prenant le deuxième élément.
  const token = authHeader && authHeader.split(" ")[1];
//Si le token n'est pas fourni, une réponse JSON avec un message d'erreur est renvoyée avec le statut 401 (Non autorisé).
  if (!token) {
    return res.status(401).json({ message: "Token non fourni" });
  }
// La méthode jwt.verify est utilisée pour vérifier le token JWT avec la clé secrète stockée dans la variable d'environnement JWT_SECRET.
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    // Si une erreur se produit lors de la vérification du token (par exemple,
    //  si le token est expiré ou incorrect), une réponse JSON avec un message d'erreur est renvoyée avec le statut 403 (Interdit).
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
    //Le payload décodé est typé comme JwtPayload.
    const payload = decoded as JwtPayload;

    // Le rôle de l'utilisateur est vérifié pour s'assurer qu'il est valide.
    //Si le rôle n'est pas dans la liste des rôles autorisés (client, admin, employé),
    //  une réponse JSON avec un message d'erreur est renvoyée avec le statut 403 (Interdit).
    if (!["client", "admin", "employé"].includes(payload.role)) {
      return res.status(403).json({ message: "Rôle utilisateur invalide" });
    }

    //  Le payload décodé est assigné à req.user pour être utilisé dans les middlewares ou contrôleurs suivants. Le payload est typé comme Utilisateur.
    req.user = payload as Utilisateur;

    // La fonction next est appelée pour passer le contrôle au middleware ou contrôleur suivant dans la chaîne de traitement des requêtes.
    next();
  });
};
