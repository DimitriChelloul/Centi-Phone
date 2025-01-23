export const validateOrigin = (req, res, next) => {
    const origin = req.headers.origin || req.headers.referer;
    if (!origin || !origin.startsWith("https://trusted-frontend.com")) {
        return res.status(403).json({ message: "Requête interdite : origine non autorisée." });
    }
    next();
};
