import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes/Index";
import { errorHandler } from "./middleware/errorHandler";
import bodyParser from "body-parser";
import cors from "cors";
import { csrfProtection, generateCsrfToken } from "./middleware/csrf";
import { corsMiddleware } from "./middleware/cors";
import UtilisateurRoutes from "../src/routes/UtilisateurRoutes";
import path from "path";
import AvisRoutes from "../src/routes/AvisRoutes";
import CommandeRoutes from "../src/routes/CommandeRoutes";
import PaymentRoutes from "../src/routes/PaymentRoutes";
import ProduitRoutes from "../src/routes/ProduitRoutes";
import ReparationRoutes from "../src/routes/ReparationRoutes";
import cookieParser from "cookie-parser";

dotenv.config();
export const app = express();

app.use(cookieParser());

// Configuration des middlewares globaux
// Middleware personnalisé
app.use(corsMiddleware);
//app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Middleware CSRF
app.use(csrfProtection);
app.use(generateCsrfToken);

app.get("/csrf-token", (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes principales
app.use("/api", router);

// Middleware global pour les erreurs
app.use(errorHandler);

app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Route de test
app.get("/", (req: Request, res: Response) => {
  res.send("Bienvenue sur le site de réparation de smartphones !");
});

app.use("/api/utilisateurs", UtilisateurRoutes);
app.use("/api/avis", AvisRoutes);
app.use("/api/commandes", CommandeRoutes);
app.use("/api/paiement", PaymentRoutes);
app.use("/api/produits", ProduitRoutes);
app.use("/api/reparations", ReparationRoutes);

// Middleware pour servir les fichiers statiques
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res, filePath) => {
      if (!filePath.endsWith(".jpg") && !filePath.endsWith(".png")) {
        res.status(403).end("Access denied");
      }
    },
  })
);

app.use((err: { code?: string } & Error, req: Request, res: Response, next: NextFunction) => {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).json({ message: "Invalid CSRF token" });
  } else {
    next(err);
  }
});
