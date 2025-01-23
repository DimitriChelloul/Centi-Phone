import request from "supertest";
import { app } from "../../api/src/app"; // Importez votre application Express
import { pool } from "../../dal/src/dal/config/db"; // Importez la configuration de la base de données

//Cette ligne définit un groupe de tests pour les tests d'intégration concernant la gestion des rendez-vous (RDVs).
describe("Tests d'intégration - Gestion des RDVs", () => {
  //Cette fonction est exécutée avant tous les tests. Elle nettoie la table rendez_vous en supprimant toutes les entrées.
  beforeAll(async () => {
    await pool.query("DELETE FROM rendez_vous");
  });

  // Après tous les tests, fermez la connexion au pool
  afterAll(async () => {
    await pool.end();
  });

  //Ce test vérifie la création d'un rendez-vous
  it("devrait créer un RDV", async () => {
    //envoie une requête POST à l'endpoint /api/rdv avec les données du rendez-vous.
    const response = await request(app)
      .post("/api/rdv")
      .send({
        utilisateurId: 1,
        dateRdv: "2025-01-15T10:00:00Z",
        problemeDescription: "Écran cassé",
      });

      //Ces lignes vérifient que la réponse a un statut 201 (Created),
      //  que le corps de la réponse contient un message de succès, et que le rendez-vous créé correspond aux données envoyées.
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Rendez-vous créé avec succès.");
    expect(response.body).toHaveProperty("rdv");
    expect(response.body.rdv).toMatchObject({
      utilisateurId: 1,
      dateRendezVous: "2025-01-15T10:00:00.000Z",
      statut: "en attente",
    });
  });

  //Ce test vérifie la récupération des rendez-vous d'un utilisateur spécifique.
  it("devrait récupérer les RDVs d'un utilisateur", async () => {
    const utilisateurId = 1;

    // Ajout d'un autre RDV pour l'utilisateur
    await pool.query(
      `INSERT INTO rendez_vous (utilisateur_id, probleme_description, date_rendez_vous, statut)
       VALUES ($1, $2, $3, $4)`,
      [utilisateurId, "Batterie faible", "2025-01-16T12:00:00Z", "en attente"]
    );

    const response = await request(app).get(`/api/rdv/utilisateur/${utilisateurId}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  it("devrait récupérer un RDV par son ID", async () => {
    const rdvId = 1;

    //envoie une requête GET pour récupérer les rendez-vous de l'utilisateur.
    const response = await request(app).get(`/api/rdv/${rdvId}`);

    //Ces lignes vérifient que la réponse a un statut 200 (OK), que le corps de la réponse est une instance de tableau, et que le tableau contient deux éléments.
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", rdvId);
    expect(response.body).toHaveProperty("statut", "en attente");
  });

  //Ce test vérifie la récupération d'un rendez-vous par son ID.
  it("devrait supprimer un RDV par son ID", async () => {
    const rdvId = 1;

    //Cette ligne envoie une requête GET pour récupérer le rendez-vous avec l'ID spécifié.
    const response = await request(app).delete(`/api/rdv/${rdvId}`);

    //Ces lignes vérifient que la réponse a un statut 200 (OK), que le corps de la réponse contient l'ID du rendez-vous, et que le statut du rendez-vous est "en attente".
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Rendez-vous supprimé avec succès.");

    // Vérifiez que le RDV a bien été supprimé
    const checkResponse = await request(app).get(`/api/rdv/${rdvId}`);
    expect(checkResponse.status).toBe(404);
    expect(checkResponse.body).toHaveProperty("message", "Rendez-vous introuvable.");
  });

  //Ce test vérifie la suppression d'un rendez-vous par son ID.
  it("devrait retourner une erreur si le RDV n'existe pas lors de la suppression", async () => {
    const rdvId = 999; // ID inexistant

    //Cette ligne envoie une requête DELETE pour supprimer le rendez-vous avec l'ID spécifié.
    const response = await request(app).delete(`/api/rdv/${rdvId}`);

    //Ces lignes vérifient que la réponse a un statut 404 (Not Found) et que le corps de la réponse contient un message indiquant que le rendez-vous est introuvable.
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Rendez-vous introuvable.");
  });
});
