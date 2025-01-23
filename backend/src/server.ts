import "./DependanceInjection/container.js";
import "reflect-metadata";
import { app } from "../api/src/app.js";
import https from "https";
import http from "http";
import fs from "fs";
import dotenv from "dotenv";
import { container } from "tsyringe";
import { RepairService } from "../bll/src/services/ReparationService.js";

// Charge les variables d'environnement
dotenv.config();

// Essaye de résoudre le service de réparation pour vérifier la configuration de l'injection de dépendances
try {
  const repairService = container.resolve(RepairService);
  console.log("RepairService résolu avec succès :", repairService);
} catch (error) {
  console.error("Erreur lors de la résolution de RepairService :", error);
}

// Récupérer le PORT depuis les variables d'environnement
const PORT = process.env.PORT || 3000;

// Configurer HTTPS si des certificats existent
const HTTPS_ENABLED = process.env.HTTPS_ENABLED === "true";

const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

let HTTPS_OPTIONS = {};

if (HTTPS_ENABLED && SSL_KEY_PATH && SSL_CERT_PATH) {
  try {
    HTTPS_OPTIONS = {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH),
    };
    console.log("HTTPS activé avec succès !");
  } catch (error) {
    console.error("Erreur lors du chargement des certificats SSL :", error);
    process.exit(1);  // Arrête le serveur si les certificats sont invalides
  }

if (HTTPS_ENABLED) {
  https.createServer(HTTPS_OPTIONS, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
  });
} else {
  // Serveur HTTP classique si HTTPS est désactivé
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP Server running on http://localhost:${PORT}`);
  });
}

}