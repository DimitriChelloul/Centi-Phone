import request from "supertest";
import { app } from "../../api/src/app"; // Chemin vers votre fichier app.ts
import { describe, it } from "node:test";
import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // Configure dotenv pour charger les variables d'environnement depuis le fichier .env situé à la racine du projet.

//describe("Tests pour la gestion des utilisateurs", () => { : Définit un groupe de tests pour la gestion des utilisateurs.
describe("Tests pour la gestion des utilisateurs", () => {
  // Utilisateur fictif pour les tests
  const testUser = {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@example.com",
    motDePasse: "password123",
    role: "client",
  };

  let userId: number; // Pour stocker l'ID de l'utilisateur créé

  // Test de création d'utilisateur
  //it("Créer un nouvel utilisateur", async () => { : Définit un test pour créer un nouvel utilisateur.
  it("Créer un nouvel utilisateur", async () => {
    //Envoie une requête POST à l'endpoint /api/users avec les données de testUser.
    const response = await request(app)
      .post("/api/users") // Remplacez par l'endpoint de création d'utilisateur
      .send(testUser)
      // Vérifie que la réponse a un statut HTTP 201 (Created).
      .expect(201);

      //Vérifie que la réponse contient une propriété id.
    expect(response.body).toHaveProperty("id");
    // Vérifie que l'email dans la réponse est le même que celui de testUser.
    expect(response.body.email).toBe(testUser.email);
    userId = response.body.id; // Stocker l'ID pour les tests suivants
  });

  // Test pour récupérer un utilisateur par son ID
  // Définit un test pour récupérer un utilisateur par son ID.
  it("Récupérer un utilisateur par ID", async () => {
    //Envoie une requête GET à l'endpoint /api/users/${userId} pour récupérer l'utilisateur par son ID.
    const response = await request(app)
      .get(`/api/users/${userId}`) // Remplacez par l'endpoint de récupération
      .expect(200);

      //Vérifie que la réponse contient une propriété id égale à userId.
    expect(response.body).toHaveProperty("id", userId);
    //Vérifie que l'email dans la réponse est le même que celui de testUser.
    expect(response.body.email).toBe(testUser.email);
  });

  // Test pour mettre à jour un utilisateur
  // Définit un test pour mettre à jour un utilisateur.
  it("Mettre à jour un utilisateur", async () => {
    // Définit les nouvelles données pour la mise à jour.
    const updatedData = { nom: "Durand", prenom: "Marie" };
    //Envoie une requête PUT à l'endpoint /api/users/
    const response = await request(app)
      .put(`/api/users/${userId}`) // Remplacez par l'endpoint de mise à jour
      .send(updatedData)
      .expect(200);

      // Vérifie que la réponse contient une propriété nom égale à updatedData.nom.
    expect(response.body).toHaveProperty("nom", updatedData.nom);
    //Vérifie que la réponse contient une propriété prenom égale à updatedData.prenom.
    expect(response.body).toHaveProperty("prenom", updatedData.prenom);
  });

  // Test pour supprimer un utilisateur
  // Définit un test pour supprimer un utilisateur.
  it("Supprimer un utilisateur", async () => {
    // Envoie une requête DELETE à l'endpoint /api/users/${userId} pour supprimer l'utilisateur.
    await request(app)
      .delete(`/api/users/${userId}`) // Remplacez par l'endpoint de suppression
      .expect(204);

    // Envoie une requête GET à l'endpoint /api/users/${userId} pour vérifier que l'utilisateur a été supprimé.
    await request(app)
      .get(`/api/users/${userId}`)
      //Vérifie que la réponse a un statut HTTP 204 (No Content).
      .expect(404);
  });

  // Test de récupération de tous les utilisateurs
  //Définit un test pour récupérer tous les utilisateurs.
  it("Récupérer tous les utilisateurs", async () => {
    //Envoie une requête GET à l'endpoint /api/users pour récupérer la liste des utilisateurs.
    const response = await request(app)
      .get("/api/users") // Remplacez par l'endpoint de liste des utilisateurs
      .expect(200);

      // Vérifie que la réponse est un tableau.
    expect(Array.isArray(response.body)).toBe(true);
  });
});
