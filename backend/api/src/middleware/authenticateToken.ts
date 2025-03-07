import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/types"; // Import correct
import { Utilisateur } from "../../../domain/src/entities/Utilisateurs";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Correction du type ici
    }
  }
}

const publicRoutes = [
  "/api/produits",
  "/api/produits/appareilsreconditionnes",
  "/csrf-token",
  "/api/utilisateurs/login",
  "/api/utilisateurs/register",
];

export const authenticateToken = (req: Request, res: Response, next: NextFunction): any => {
  console.log(`🔒 [DEBUG] authenticateToken exécuté pour : ${req.path}`);

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("🚨 [DEBUG] JWT Token manquant !");
    return res.status(401).json({ error: "JWT Token manquant !" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET non défini");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    console.log("✅ [DEBUG] JWT Token valide :", decoded);
    next();
  } catch (error) {
    console.error("🚨 [DEBUG] Erreur JWT :", (error as Error).message);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expiré" });
    }
    return res.status(403).json({ message: "Token invalide" });
  }
};
