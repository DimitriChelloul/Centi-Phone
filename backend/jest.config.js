/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest', // Utilisation de ts-jest pour transformer les fichiers TypeScript
  testEnvironment: 'node', // Environnement Node.js pour exécuter les tests
  testMatch: [
    '**/tests/unit/**/*.test.ts',        // Détecte les tests unitaires
    '**/tests/integration/**/*.test.ts' // Détecte les tests d'intégration
  ],
  collectCoverage: true, // Active la collecte de couverture
  coverageDirectory: 'coverage', // Dossier pour les rapports de couverture
  coveragePathIgnorePatterns: [
    '/node_modules/', // Ignore les dépendances
    '/tests/'         // Ignore les fichiers de test
  ],
  verbose: true, // Affiche les détails des tests exécutés
  bail: false, // N'arrête pas les tests au premier échec (mettre à true si nécessaire)
  setupFiles: ['dotenv/config'], // Charge automatiquement les variables d'environnement
  testTimeout: 30000, // Définit un délai d'attente de 30 secondes pour les tests asynchrones
  globals: {
    'ts-jest': {
      isolatedModules: true, // Améliore les performances en compilant les fichiers séparément
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Extensions reconnues par Jest
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Formats de rapport de couverture
};
