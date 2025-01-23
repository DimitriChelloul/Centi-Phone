import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";
/**
 * Génère un token JWT avec les informations essentielles de l'utilisateur.
 * @param payload - Les données de l'utilisateur à inclure dans le token.
 * @param expiresIn - Durée de validité du token (ex : '1h', '7d').
 * @returns Le token JWT signé.
 */
export const generateToken = (payload, expiresIn = "1h") => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};
/**
 * Vérifie et décode un token JWT.
 * @param token - Le token JWT à vérifier.
 * @returns Le payload du token si valide, sinon null.
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    }
    catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};
