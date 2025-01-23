// Classe d'erreur personnalisée
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Nécessaire pour que `instanceof` fonctionne correctement
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
// Middleware global pour gérer les erreurs
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof AppError) {
        // Gérer les erreurs personnalisées
        res.status(err.statusCode).json({ message: err.message });
    }
    else {
        // Gérer les erreurs non prévues
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
