import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Utiliser ts-jest pour supporter TypeScript
  testEnvironment: 'node', // Environnement pour exécuter les tests (Node.js)
  moduleFileExtensions: ['ts', 'js', 'json'], // Extensions reconnues
  rootDir: './', // Racine du projet
  testMatch: [
    '**/tests/integrations/**/*.test.ts', // Tests d'intégration
    '**/tests/unitaires/**/*.test.ts', // Tests unitaires
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transformation des fichiers TypeScript en JavaScript
  },
  moduleNameMapper: {
    '^@dal/(.*)$': '<rootDir>/dal/src/$1',
    '^@bll/(.*)$': '<rootDir>/bll/src/$1',
    '^@api/(.*)$': '<rootDir>/api/src/$1',
    '^@domain/(.*)$': '<rootDir>/domain/src/$1',
  },
  globals: {
    'ts-jest': {
      isolatedModules: true, // Amélioration des performances pour des tests isolés
    },
  },
  setupFiles: ['<rootDir>/jest.setup.ts'], // Fichier de configuration supplémentaire (facultatif)
  verbose: true, // Affiche les résultats des tests de manière détaillée
  collectCoverage: true, // Activer la collecte de la couverture
  collectCoverageFrom: [
    'api/src/**/*.ts',
    'bll/src/**/*.ts',
    'dal/src/**/*.ts',
    'domain/src/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/tests/**',
  ],
  coverageDirectory: '<rootDir>/coverage', // Dossier de rapport de couverture
};

export default config;
