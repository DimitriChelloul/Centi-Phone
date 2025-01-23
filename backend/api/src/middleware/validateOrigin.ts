import { Request, Response, NextFunction } from "express";

export const validateOrigin = (req: Request, res: Response, next: NextFunction): any => {
  const origin = req.headers.origin || req.headers.referer;

  if (!origin || !origin.startsWith("https://localhost:4200")) {
    return res.status(403).json({ message: "Requête interdite : origine non autorisée." });
  }

  next();
};
