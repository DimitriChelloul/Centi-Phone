import "reflect-metadata";
import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes/Index";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { corsMiddleware } from "./middleware/cors";
import UtilisateurRoutes from "../src/routes/UtilisateurRoutes";
import AvisRoutes from "../src/routes/AvisRoutes";
import CommandeRoutes from "../src/routes/CommandeRoutes";
import PaymentRoutes from "../src/routes/PaymentRoutes";
import ProduitRoutes from "../src/routes/ProduitRoutes";
import ReparationRoutes from "../src/routes/ReparationRoutes";
import { testDbConnection } from './../../dal/src/dal/config/db';
import { doubleCsrf } from 'csrf-csrf';
import { authenticateToken } from "./middleware/authenticateToken";
import CalendrierRoutes from "routes/CalendrierRoutes";

dotenv.config();
export const app = express();



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

app.use((req, res, next) => {
  console.log(`🔹 [DEBUG] Requête reçue: ${req.method} ${req.path}`);
  next();
});

//app.use(bodyParser.json());

// ✅ Configuration de la session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
       secure: false ,
        httpOnly: false,
        sameSite: "lax"}
  })
);

console.log("🚀 [DEBUG] Serveur en cours d'exécution - Vérification des logs");
app.use((req, res, next) => {
  console.log(`🔹 [DEBUG] Middleware CORS - Requête reçue: ${req.method} ${req.path}`);
  next();
});


const protectedRoutes = [
  "/api/commandes",
  "/api/paiement",
  "/api/reparations",
];

app.use((req, res, next) => {
  console.log(`🔹 [DEBUG] Vérification des middlewares pour ${req.method} ${req.path}`);

  // Exclure explicitement les routes publiques
  if (
    req.path.startsWith("/api/produits") ||
    req.path.startsWith("/api/produits/produits") ||
    req.path.startsWith("/api/produits/appareilsreconditionnes") ||
    req.path.startsWith("/api/utilisateurs/login") ||
    req.path.startsWith("/api/utilisateurs/register")
  ) {
    console.log(`✅ [DEBUG] Route publique détectée : ${req.path} - Pas de JWT requis.`);
    return next();
  }

  // Appliquer l'authentification uniquement aux routes protégées
  if (protectedRoutes.some(route => req.path.startsWith(route))) {
    console.log(`🔒 [DEBUG] Vérification JWT requise pour : ${req.path}`);
    return authenticateToken(req, res, next);
  }

  next();
});

app.use((req, res, next) => {
  console.log(`🔹 [DEBUG] Vérification des middlewares pour ${req.method} ${req.path}`);
  next();
});

//app.get("/csrf-token", (req, res) => {
 // console.log("🔹 [DEBUG] Génération du token CSRF...");
  //const token = generateToken(req, res);
  //console.log("✅ [DEBUG] Token généré :", token);

 // res.cookie('X-CSRF-Token', token, {
   // httpOnly: false, // ⚠️ Doit être accessible côté client
   // secure: false, // ⚠️ Teste avec `false` temporairement pour voir si ça bloque
   // sameSite: "lax"
  //});

 // res.json({ csrfToken: token });
//});

app.use((req, res, next) => {
  console.log("🔹 [DEBUG] Vérification CSRF Token entre COOKIE et HEADER");
  console.log("🔹 Liste complète des cookies reçus :", req.cookies);
  console.log("🔹 Token en COOKIE (`X-CSRF-Token`) :", req.cookies['X-CSRF-Token']);
  console.log("🔹 Token en COOKIE (`XSRF-TOKEN`) :", req.cookies['XSRF-TOKEN']);
  console.log("🔹 Token en HEADER :", req.headers['x-csrf-token']);

  next();
});




app.use((req, res, next) => {
  console.log("🔹 [DEBUG] Comparaison du Token CSRF entre COOKIE et HEADER");

  const cookieToken = req.cookies["X-CSRF-Token"] || req.cookies["XSRF-TOKEN"];
  const headerToken = req.headers["x-csrf-token"];

  console.log(`🔹 Token en COOKIE : ${cookieToken}`);
  console.log(`🔹 Token en HEADER : ${headerToken}`);

  if (cookieToken && headerToken) {
    const expectedToken = cookieToken.split("|")[0]; // Prendre la partie avant `|`
    console.log(`🔍 [DEBUG] Comparaison : COOKIE = ${expectedToken} | HEADER = ${headerToken}`);

    if (expectedToken !== headerToken) {
      console.error("❌ [ERROR] CSRF Token Mismatch !");
    }
  } else {
    console.error("❌ [ERROR] CSRF Token manquant !");
  }

  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("[DEBUG] Vérification des cookies envoyés par le client...");
  console.log("🔹 Cookies:", req.cookies);
  next();
});


app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("[DEBUG] Vérification du CSRF...");
  console.log("🔹 Token en COOKIE:", req.cookies["X-CSRF-Token"]);
  console.log("🔹 Token en HEADER:", req.headers["X-CSRF-token"]);
  console.log("🔹 Méthode:", req.method, "URL:", req.path);
  next();
});


//const { generateToken, doubleCsrfProtection } = doubleCsrf({
 // getSecret: () => process.env.CSRF_SECRET || "default_secret", // ✅ Correction du type
 // cookieName: "X-CSRF-Token",
 // cookieOptions: {
  //  httpOnly: false, // ✅ Doit être accessible côté client
  //  sameSite: "none",
  //  secure: false,
 // },
 // size: 64,
 // ignoredMethods: ["GET", "HEAD", "OPTIONS"], // ✅ GET est exempté
//});


app.use((req, res, next) => {
  console.log("🔹 [DEBUG] Vérification CSRF Middleware");
  console.log("🔹 Méthode:", req.method, "URL:", req.path);
  console.log("🔹 Token en COOKIE:", req.cookies["X-CSRF-Token"]);
  console.log("🔹 Token en HEADER:", req.headers["x-csrf-token"]);
  console.log("🔹 Cookie complet:", req.cookies);
  next();
});

//  Ignorer CSRF pour certaines routes (login, register, etc.)
const csrfExemptRoutes = [
  "/api/utilisateurs/login",
  "/api/utilisateurs/register",
  "/csrf-token",
  "/api/produits/produits",
  "/api/produits/appareilsreconditionnes",
  "/api/reparations/rdv"
];

//app.use((req, res, next) => {
//  console.log(`🔹 [DEBUG] Vérification CSRF pour ${req.method} ${req.path}`);


// if (csrfExemptRoutes.some(route => req.path.startsWith(route))) {
//  console.log(`✅ CSRF ignoré pour cette route : ${req.path}`);
 // return next();
//}

//  doubleCsrfProtection(req, res, next);
//});

app.use((req, res, next) => {
  console.log("[DEBUG] Vérification CSRF Middleware");
  console.log("🔹 Méthode:", req.method, "URL:", req.path);
  console.log("🔹 Token en COOKIE:", req.cookies['X-CSRF-Token']);
  console.log("🔹 Token en HEADER:", req.headers['X-CSRF-token']);
  next();
});


// Gestionnaire d'erreurs CSRF corrigé
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.code === 'CSRF_TOKEN_ERROR') {
    res.status(403).json({ error: 'Token CSRF invalide' });
  } else {
    next(err);
  }
};

// Routes principales
app.use("/api", router);

console.log('🔹 [DEBUG] Liste des routes enregistrées dans Express :');
app._router.stack.forEach((r:any) => {
    if (r.route && r.route.path) {
        console.log(`   ${r.route.path}`);
    }
});

app.use("/api/utilisateurs", UtilisateurRoutes);
app.use("/api/avis", AvisRoutes);
app.use("/api/produits", ProduitRoutes);
app.use("/api/commandes", CommandeRoutes);
app.use("/api/paiement", PaymentRoutes);
app.use("/api/reparations", ReparationRoutes);
app.use("/api/calendrier",CalendrierRoutes,)

// Middleware global pour les erreurs
app.use(errorHandler as ErrorRequestHandler);

// Vérification de la connexion à la base de données
testDbConnection();
