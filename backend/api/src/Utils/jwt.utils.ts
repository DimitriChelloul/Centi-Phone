import jwt, { Secret, SignOptions } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

// types.ts
export interface JwtPayload {
  userId: number;  // ⚠️ Changé de 'id' à 'userId' pour correspondre au token généré
  email: string;
  role: "client" | "admin" | "employé";
  fullName: string;
  iat?: number;
  exp?: number;
}

/**
 * Génère un token JWT avec les informations essentielles de l'utilisateur.
 * @param payload - Les données de l'utilisateur à inclure dans le token.
 * @param expiresIn - Durée de validité du token (ex : '1h', '7d').
 * @returns Le token JWT signé.
 */
export const generateToken = (
  payload: JwtPayload, 
  expiresIn: jwt.SignOptions["expiresIn"] = "1h"
): string => {
  try {
    // Type assertion plus claire pour SECRET_KEY
    const secretKey = SECRET_KEY as string;
    // Création d'un objet options typé
    const signOptions = {
      expiresIn: expiresIn
    };
    
    // Utilisation de la méthode sign avec les types corrects
    return jwt.sign(
      payload as jwt.JwtPayload,
      secretKey,
      signOptions
    );
  } catch (error) {
    console.error("Token generation failed:", error);
    throw error;
  }
};

/**
 * Vérifie et décode un token JWT.
 * @param token - Le token JWT à vérifier.
 * @returns Le payload du token si valide, sinon null.
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    //utilise jwt.verify pour vérifier et décoder le token avec la clé secrète.
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    //Si une erreur se produit (par exemple, si le token est expiré ou invalide), l'erreur est loguée et la fonction retourne null.
    console.error("Token verification failed:", error);
    return null;
  }
};


