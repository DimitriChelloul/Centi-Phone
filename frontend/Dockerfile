# Étape 1 : Construction de l'application Angular
FROM node:18 AS build
WORKDIR /app

# Copie des fichiers package.json et installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du reste des fichiers et construction de l'application
COPY . .
RUN npm run build --prod

# Étape 2 : Exécution de l'application avec un serveur Node.js
FROM node:18 AS runtime
WORKDIR /app

# Copie des fichiers de build Angular
COPY --from=build /app/dist /app/dist

# Installation d'un simple serveur HTTP pour Node.js
RUN npm install -g http-server

# Exposition du port utilisé par http-server
EXPOSE 4200

# Lancement du serveur sur le répertoire de build
CMD ["http-server", "/app/dist", "-p", "4200", "-a", "0.0.0.0"]
