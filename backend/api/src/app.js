import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import router from "./routes/Index";
import { errorHandler } from "./middleware/errorHandler";
import bodyParser from "body-parser";
import cors from "cors";
import { csrfProtection, generateCsrfToken } from "./middleware/csrf";
import { corsMiddleware } from "./middleware/cors";
dotenv.config();
export const app = express();
// Configuration des middlewares globaux
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// Middleware personnalisé (si nécessaire)
app.use(corsMiddleware);
// Routes principales
app.use("/api", router);
// Middleware CSRF
app.use(csrfProtection);
app.use(generateCsrfToken);
// Middleware global pour les erreurs
app.use(errorHandler);
// Route de test
app.get("/", (req, res) => {
    res.send("Bienvenue sur le site de réparation de smartphones !");
});
// Middleware global pour gérer les erreurs spécifiques
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        res.status(403).json({ message: "Invalid CSRF token" });
    }
    else {
        next(err);
    }
});
