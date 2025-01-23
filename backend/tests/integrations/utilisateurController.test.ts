import request from 'supertest';
import { app } from '../../api/src/app'; // Assurez-vous que ce chemin correspond à votre serveur Express
import { pool } from '../../dal/src/dal/config/db'; // Pool de base de données

// Nettoyage après chaque test
afterEach(async () => {
  await pool.query('DELETE FROM utilisateurs'); // Supprimez les utilisateurs pour éviter les conflits entre tests
});

// Fermez la connexion à la base de données après tous les tests
afterAll(async () => {
  await pool.end();
});

//Cette ligne définit un groupe de tests pour les tests d'intégration concernant la gestion des utilisateurs.
describe('Tests d\'intégration - Gestion des utilisateurs', () => {
  //Ce test vérifie la création d'un nouvel utilisateur
  it('devrait créer un nouvel utilisateur', async () => {
    //définit un objet utilisateur avec les informations nécessaires.
    const utilisateur = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      motDePasse: 'Password123!',
    };

    //envoie une requête POST à l'endpoint /api/utilisateurs avec les données de l'utilisateur et s'attend à une réponse avec le statut 201 (Created).
    const response = await request(app)
      .post('/api/utilisateurs')
      .send(utilisateur)
      .expect(201);

      // vérifient que le corps de la réponse contient un objet avec les propriétés attendues, y compris un id de type nombre et les autres informations de l'utilisateur.
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
      })
    );
  });

  //vérifie la récupération de tous les utilisateurs
  it('devrait retourner tous les utilisateurs', async () => {
    //définit deux objets utilisateur avec des informations différentes.
    const utilisateur1 = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      motDePasse: 'Password123!',
    };
    const utilisateur2 = {
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'sophie.martin@example.com',
      motDePasse: 'Password456!',
    };

    // créent deux utilisateurs en envoyant des requêtes POST à l'endpoint /api/utilisateurs.
    await request(app).post('/api/utilisateurs').send(utilisateur1);
    await request(app).post('/api/utilisateurs').send(utilisateur2);

    //envoie une requête GET à l'endpoint /api/utilisateurs et s'attend à une réponse avec le statut 200 (OK).
    const response = await request(app)
      .get('/api/utilisateurs')
      .expect(200);

      // vérifient que le corps de la réponse est un tableau contenant deux éléments, chacun ayant les propriétés attendues, y compris les emails des utilisateurs créés.
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: utilisateur1.email }),
        expect.objectContaining({ email: utilisateur2.email }),
      ])
    );
  });

  // vérifie la récupération d'un utilisateur par son ID
  it('devrait retourner un utilisateur par ID', async () => {
    //définit un objet utilisateur avec les informations nécessaires.
    const utilisateur = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      motDePasse: 'Password123!',
    };

    // crée un utilisateur en envoyant une requête POST à l'endpoint /api/utilisateurs et stocke la réponse dans createdUser.
    const createdUser = await request(app)
      .post('/api/utilisateurs')
      .send(utilisateur);

      // envoie une requête GET à l'endpoint /api/utilisateurs/{id} avec l'ID de l'utilisateur créé et s'attend à une réponse avec le statut 200 (OK).
    const response = await request(app)
      .get(`/api/utilisateurs/${createdUser.body.id}`)
      .expect(200);

      // vérifient que le corps de la réponse contient un objet avec les propriétés attendues,
      //  y compris l'ID de l'utilisateur créé et les autres informations de l'utilisateur.
    expect(response.body).toEqual(
      expect.objectContaining({
        id: createdUser.body.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
      })
    );
  });

  //vérifie la mise à jour d'un utilisateur
  it('devrait mettre à jour un utilisateur', async () => {
    //définit un objet utilisateur avec les informations nécessaires.
    const utilisateur = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      motDePasse: 'Password123!',
    };

    // crée un utilisateur en envoyant une requête POST à l'endpoint /api/utilisateurs et stocke la réponse dans createdUser.
    const createdUser = await request(app)
      .post('/api/utilisateurs')
      .send(utilisateur);

      //définit un objet updatedData avec les nouvelles informations de l'utilisateur
    const updatedData = {
      nom: 'Dupont',
      prenom: 'Jean-Paul',
      email: 'jean.paul@example.com',
    };

    //envoie une requête PUT à l'endpoint /api/utilisateurs/{id} avec l'ID de l'utilisateur créé et les nouvelles données, et s'attend à une réponse avec le statut 200 (OK).
    const response = await request(app)
      .put(`/api/utilisateurs/${createdUser.body.id}`)
      .send(updatedData)
      .expect(200);

      //vérifient que le corps de la réponse contient un objet avec les propriétés mises à jour,
      //  y compris l'ID de l'utilisateur créé et les nouvelles informations de l'utilisateur
    expect(response.body).toEqual(
      expect.objectContaining({
        id: createdUser.body.id,
        nom: updatedData.nom,
        prenom: updatedData.prenom,
        email: updatedData.email,
      })
    );
  });

  //vérifie la suppression d'un utilisateur
  it('devrait supprimer un utilisateur', async () => {
    const utilisateur = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      motDePasse: 'Password123!',
    };

    //crée un utilisateur en envoyant une requête POST à l'endpoint /api/utilisateurs et stocke la réponse dans createdUser.
    const createdUser = await request(app)
      .post('/api/utilisateurs')
      .send(utilisateur);

    //  envoie une requête DELETE à l'endpoint /api/utilisateurs/{id} avec l'ID de l'utilisateur créé et s'attend à une réponse avec le statut 204 (No Content).
    await request(app)
      .delete(`/api/utilisateurs/${createdUser.body.id}`)
      .expect(204);

    // envoie une requête GET à l'endpoint /api/utilisateurs/{id}
    //  avec l'ID de l'utilisateur supprimé et s'attend à une réponse avec le statut 404 (Not Found),
    //  vérifiant ainsi que l'utilisateur a bien été supprimé.
    await request(app)
      .get(`/api/utilisateurs/${createdUser.body.id}`)
      .expect(404);
  });
});
