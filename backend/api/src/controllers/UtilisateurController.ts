import express, { NextFunction, Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";
import { UtilisateurService } from "../../../bll/src/services/UtilisateurService";
import { IUtilisateurService } from "../../../bll/src/Interfaces/IUtilisateurService";  
import { Utilisateur } from "../../../domain/src/entities/Utilisateurs";

import { asyncHandler } from "../Utils/asyncHandler";
import { authenticateToken } from "../middleware/authenticateToken";
import { body, validationResult } from "express-validator";
import {validateDelete, validateLogin,validateRegister} from "../middleware/UtilisateurValidation";
import { generateToken } from "../Utils/jwt.utils";




export const utilisateurController = {

    // Enregistrement d'un nouvel utilisateur
    //définit une méthode asynchrone register qui prend deux arguments : req (de type Request) et res (de type Response)
    async register(req: Request, res: Response) {

      //utilise le conteneur de dépendances pour résoudre une instance de UtilisateurService.
      const utilisateurService = container.resolve(UtilisateurService);

      //déstructure le corps de la requête (req.body) pour extraire les propriétés nom, prenom, email, motDePasse, et role.
      const { nom, prenom, email, motDePasse, role } = req.body;
  
      try {
      //hache le mot de passe (motDePasse) en utilisant bcrypt avec un sel de 10.
        const hashedPassword = await bcrypt.hash(motDePasse, 10);
        //crée un objet utilisateur avec les propriétés extraites et le mot de passe haché
        const utilisateur = {
          
          nom,
          prenom,
          email,
          mot_de_passe: hashedPassword,
          role: role || "client",
         dateInscription: new Date(),
         consentementRgpd : true
        };
  // appelle la méthode createUtilisateur du service UtilisateurService pour créer un nouvel utilisateur.
        const newUser = await utilisateurService.createUtilisateur(utilisateur);

        //renvoie une réponse JSON avec un message de succès et les détails du nouvel utilisateur si l'opération réussit
        res.status(201).json({ message: "Utilisateur créé avec succès.", utilisateur: newUser });
      } catch (error) {
        //Si une erreur se produit, il renvoie une réponse JSON avec un message d'erreur et un statut 500.
        res.status(500).json({ message: (error as Error).message });
      }
    },
  
    // Connexion utilisateur
    //définit une méthode asynchrone login qui prend deux arguments : req (de type Request) et res (de type Response)
    async login(req: Request, res: Response): Promise<any> {
      // utilisent le conteneur de dépendances pour résoudre une instance de UtilisateurService et déstructurent le corps de la requête pour extraire les propriétés email et motDePasse.
      const utilisateurService = container.resolve(UtilisateurService);
      const { email, motDePasse } = req.body;

      console.log("Email reçu :", email);
      console.log("Mot de passe reçu :", motDePasse);

  
      try {
        // récupèrent tous les utilisateurs et trouvent l'utilisateur correspondant à l'email fourni.
        const utilisateurs = await utilisateurService.getAllUtilisateurs();
        const user = utilisateurs.find((u) => u.email === email);

        console.log("Utilisateur trouvé :", user);
        console.log("Mot de passe stocké :", user?.mot_de_passe);
  //Si l'utilisateur n'est pas trouvé, il renvoie une réponse JSON avec un message d'erreur et un statut 401.
        if (!user) {
          return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        if (!user || !user.mot_de_passe) {
          return res.status(401).json({ message: "Email ou mot de passe incorrect." });
      }
      if (!motDePasse || !user.mot_de_passe) {
        return res.status(400).json({ message: "Mot de passe non fourni" });
    }
  //comparent le mot de passe fourni avec le mot de passe haché de l'utilisateur. Si les mots de passe ne correspondent pas, il renvoie une réponse JSON avec un message d'erreur et un statut 401.
        const isMatch = await bcrypt.compare(motDePasse, user.mot_de_passe);
        if (!isMatch) {
          return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }
  //Si l'ID de l'utilisateur est introuvable, il renvoie une réponse JSON avec un message d'erreur et un statut 500.
        if (!user.id) {
            return res.status(500).json({ message: "L'ID utilisateur est introuvable." });
          }
//génère un jeton JWT avec les informations de l'utilisateur et une durée de validité de 7 jours.
const token = generateToken({
  userId: user.id,
  email: user.email,
  role: user.role,
  fullName: `${user.nom} ${user.prenom}`
}, "7d");
  //renvoie une réponse JSON avec un message de succès et le jeton JWT si l'opération réussit
        res.status(200).json({ message: "Connexion réussie.", token });
      } catch (error) {
        //Si une erreur se produit, il renvoie une réponse JSON avec un message d'erreur et un statut 500.
        res.status(500).json({ message: (error as Error).message });
      }
    },
  
    // Récupération du profil utilisateur
    // récupère le profil de l'utilisateur connecté
    async getProfile(req: Request, res: Response) {
      try {
        // renvoie une réponse JSON avec les détails du profil
        res.status(200).json({ message: "Profil utilisateur récupéré.", data: req.user });
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        //Si une erreur se produit, il renvoie une réponse JSON avec un message d'erreur et un statut 500.
        res.status(500).json({ message: (error as Error).message });
      }
    },


     // Supprimer un utilisateur
     async deleteUser(req: Request, res: Response, next: NextFunction) {
      const utilisateurService = container.resolve(UtilisateurService);
      const utilisateurId = Number(req.params.id);
      try {
          await utilisateurService.deleteUtilisateur(utilisateurId);
          res.status(200).json({ message: "Utilisateur supprimé avec succès." });
      } catch (error) {
          next(error);
      }
  },

  // Récupérer tous les utilisateurs
  async getAllUser(req: Request, res: Response, next: NextFunction) {
      const utilisateurService = container.resolve(UtilisateurService);
      try {
          const utilisateurs = await utilisateurService.getAllUtilisateurs();
          res.status(200).json(utilisateurs);
      } catch (error) {
          next(error);
      }
  },

 // Récupérer un utilisateur par ID
 async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const utilisateurService = container.resolve(UtilisateurService);
  const utilisateurId = Number(req.params.id);
  try {
      const user = await utilisateurService.getUtilisateurById(utilisateurId);
      if (!user) {
           res.status(404).json({ message: "Utilisateur non trouvé." });
      }
      res.status(200).json(user);
  } catch (error) {
      next(error);
  }
},

// Mettre à jour un utilisateur
async updateUser(req: Request, res: Response, next: NextFunction): Promise<any> {
  const utilisateurService = container.resolve(UtilisateurService);
  const utilisateurId = Number(req.params.id);
  const { nom, prenom, email, motDePasse, role } = req.body;

  try {
      const user = await utilisateurService.getUtilisateurById(utilisateurId);
      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      const updatedUser: Partial<Utilisateur> = {
          nom: nom || user.nom,
          prenom: prenom || user.prenom,
          email: email || user.email,
          role: role || user.role,
      };

      if (motDePasse) {
          updatedUser.mot_de_passe = await bcrypt.hash(motDePasse, 10);
      }

      const updated = await utilisateurService.updateUtilisateur(utilisateurId, updatedUser);
      res.status(200).json({ message: "Utilisateur mis à jour avec succès.", utilisateur: updated });
  } catch (error) {
      next(error);
  }
}



};

export default utilisateurController;
