import cors from "cors";
export const corsOptions = {
    origin: ["https://trusted-frontend.com"], // Remplacez par votre URL de frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Permet d'envoyer les cookies avec les requêtes
};
export const corsMiddleware = cors(corsOptions);
