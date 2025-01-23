import bcrypt from "bcrypt";
import { container } from "tsyringe";
import { UtilisateurService } from "../../../bll/src/services/UtilisateurService";
import { generateToken } from "../../src/Utils.ts/jwt.utils";
export const utilisateurController = {
    // Enregistrement d'un nouvel utilisateur
    async register(req, res) {
        const utilisateurService = container.resolve(UtilisateurService);
        const { nom, prenom, email, motDePasse, role } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(motDePasse, 10);
            const utilisateur = {
                nom,
                prenom,
                email,
                motDePasse: hashedPassword,
                role: role || "client",
                dateInscription: new Date(),
                consentementRgpd: true
            };
            const newUser = await utilisateurService.createUtilisateur(utilisateur);
            res.status(201).json({ message: "Utilisateur créé avec succès.", utilisateur: newUser });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Connexion utilisateur
    async login(req, res) {
        const utilisateurService = container.resolve(UtilisateurService);
        const { email, motDePasse } = req.body;
        try {
            const utilisateurs = await utilisateurService.getAllUtilisateurs();
            const user = utilisateurs.find((u) => u.email === email);
            if (!user) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect." });
            }
            const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
            if (!isMatch) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect." });
            }
            if (!user.id) {
                return res.status(500).json({ message: "L'ID utilisateur est introuvable." });
            }
            const token = generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
                fullName: `${user.nom} ${user.prenom}`,
            }, "7d");
            res.status(200).json({ message: "Connexion réussie.", token });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Récupération du profil utilisateur
    async getProfile(req, res) {
        try {
            res.status(200).json({ message: "Profil utilisateur récupéré.", data: req.user });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
export default utilisateurController;
