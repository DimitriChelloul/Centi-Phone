import csrf from "csurf";
import { Request, Response, NextFunction } from "express";

// Configuration du middleware CSRF
export const csrfProtection = csrf({
  cookie: {
    httpOnly: true, // Sécurise le cookie pour éviter son accès côté client
    secure: process.env.NODE_ENV === "production", // Active HTTPS en production
    sameSite: "strict", // Empêche les requêtes cross-site
  },
});

// Middleware pour générer le token CSRF
export const generateCsrfToken = (req: Request, res: Response, next: NextFunction): void => {
  console.log("Generating CSRF token");
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    httpOnly: false, // Accessible côté client pour inclusion dans les requêtes
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  next();
};
