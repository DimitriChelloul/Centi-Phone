import { pool } from './config/db';

// Fonction pour tester la connexion à PostgreSQL
export const testDbConnection = async (): Promise<void> => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Connexion réussie à PostgreSQL ! Heure actuelle du serveur :', result.rows[0].now);
  } catch (error) {
    console.error('Erreur lors de la connexion à PostgreSQL :', error);
  } finally {
    await pool.end(); // Ferme la connexion pour éviter les fuites de ressources
  }
};