# Étape 1 : Utiliser une image de Node.js basée sur Alpine pour minimiser la taille
FROM node:20-alpine AS build

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier uniquement les fichiers de dépendances pour l'installation
COPY package*.json ./

# Étape 4 : Installer les dépendances en mode production
RUN npm install --only=production

# Étape 5 : Copier tous les fichiers du projet dans le conteneur
COPY . .

# Étape 6 : Compiler le projet TypeScript
RUN npm run build

# Étape 7 : Utiliser une image plus légère pour l'exécution
FROM node:20-alpine AS runtime

# Étape 8 : Définir le répertoire de travail pour l'application
WORKDIR /app

# Étape 9 : Copier uniquement les fichiers nécessaires pour l'exécution
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Étape 10 : Installer uniquement les dépendances de production dans l'image finale
RUN npm install --only=production

# Étape 11 : Exposer le port de l'application (défini dans l'environnement ou par défaut 3000)
EXPOSE 3000

# Étape 12 : Définir les variables d'environnement
ENV NODE_ENV=production

# Étape 13 : Définir la commande de démarrage de l'application
CMD ["node", "dist/src/server.js"]
