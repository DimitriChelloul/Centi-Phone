import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

export interface Payload {
  userId: number;         // ID de l'utilisateur
  email: string;          // Adresse e-mail
  role: string;           // Rôle de l'utilisateur ('admin', 'client', etc.)
  fullName?: string;      // Nom complet de l'utilisateur (optionnel)
  iat?: number;           // Ajouté automatiquement : Date d'émission
  exp?: number;           // Ajouté automatiquement : Date d'expiration
}

/**
 * Génère un token JWT avec les informations essentielles de l'utilisateur.
 * @param payload - Les données de l'utilisateur à inclure dans le token.
 * @param expiresIn - Durée de validité du token (ex : '1h', '7d').
 * @returns Le token JWT signé.
 */
export const generateToken = (payload: Payload, expiresIn = "1h"): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

/**
 * Vérifie et décode un token JWT.
 * @param token - Le token JWT à vérifier.
 * @returns Le payload du token si valide, sinon null.
 */
export const verifyToken = (token: string): Payload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as Payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};


