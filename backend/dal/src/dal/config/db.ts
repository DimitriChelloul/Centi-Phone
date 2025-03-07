import { Pool } from 'pg';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Configuration du pool PostgreSQL
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20,  // Augmente le nombre max de connexions
  idleTimeoutMillis: 30000, // Ferme les connexions inactives après 30s
  connectionTimeoutMillis: 2000,
});

// Événements de connexion et d'erreur
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

// Gestion des erreurs typées
pool.on('error', (error: unknown) => {
  if (error instanceof Error) {
    console.error('Unexpected error on idle PostgreSQL client:', error.message);
  } else {
    console.error('Unexpected error:', JSON.stringify(error));
  }
});
// Fonction utilitaire pour exécuter des requêtes
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;}
    catch (error) {
      console.error(`❌ Erreur lors de l'exécution de la requête: ${error}`);
      throw error;
    }
   finally {
    client.release();
  }
};

// Fonction pour vérifier la connexion
export const testDbConnection = async () => {
  try {
    const res = await query('SELECT NOW()');
    console.log('✅ Vérification de la connexion réussie:', res);
  } catch (error) {
    console.error('❌ Échec de la vérification de la connexion:', error);
  }
};

export default pool;
