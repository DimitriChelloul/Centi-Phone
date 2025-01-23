import csrf from "csurf";
// Configuration CSRF
export const csrfProtection = csrf({ cookie: true });
// Middleware pour générer un jeton CSRF
export const generateCsrfToken = (req, res, next) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken, { httpOnly: false, secure: true, sameSite: "strict" });
    next();
};
