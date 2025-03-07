import csrf from "csurf";
import { Request, Response, NextFunction } from "express";

const excludedPaths = [
  '/api/utilisateurs/login',
  '/api/utilisateurs/register'
  
];

export const shouldExcludePath = (req: Request): boolean => {
  return excludedPaths.some(path => req.path.includes(path));
};


const getTokenFromRequest = (req: Request): string => {
  // Vérifier d'abord dans les headers
  const tokenFromHeader = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
  if (tokenFromHeader) return Array.isArray(tokenFromHeader) ? tokenFromHeader[0] : tokenFromHeader;

  // Ensuite vérifier dans les cookies
  return req.cookies['XSRF-TOKEN'];
};

export const csrfDebug = (req: Request, res: Response, next: NextFunction) => {
  console.log("=== [DEBUG] Vérification CSRF avant middleware ===");
  console.log("🔹 CSRF Token reçu en cookie:", req.cookies["_csrf"]);
  console.log("🔹 CSRF Token reçu dans l'en-tête:", req.headers["x-xsrf-token"] || req.headers["x-csrf-token"]);
  console.log("🔹 Méthode:", req.method, "URL:", req.path);
  next();
};









