import jwt from "jsonwebtoken";
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token non fourni" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide" });
        }
        const payload = decoded;
        // Vérifiez que le rôle est valide (si vous avez des restrictions sur les rôles)
        if (!["client", "admin", "employé"].includes(payload.role)) {
            return res.status(403).json({ message: "Rôle utilisateur invalide" });
        }
        // Assignez le payload décodé à `req.user`
        req.user = payload;
        next();
    });
};
