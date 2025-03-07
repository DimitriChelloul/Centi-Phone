import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { CommonEngine } from '@angular/ssr/node';
import { APP_BASE_HREF } from '@angular/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { AppComponent } from './src/app/app.component';
import { appConfig } from './src/app/app.config';

// Chemins vers les certificats SSL
const SSL_CERT_PATH = "C:/Users/Dimitri chelloul/Centi-Phone/backend/server.crt";
const SSL_KEY_PATH = "C:/Users/Dimitri chelloul/Centi-Phone/backend/server.key";

// Configuration SSL
const useSSL = fs.existsSync(SSL_CERT_PATH) && fs.existsSync(SSL_KEY_PATH);
const sslOptions = useSSL
  ? {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH),
    }
  : null;

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    })
  );

  server.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,  // Change l'origine de la requête vers le backend
      secure: false,  // Désactive la vérification SSL pour les certificats auto-signés
      headers: {
        'X-Forwarded-For': 'localhost'
      },
    })
  );
  

  // Fonction de bootstrap pour Angular SSR avec gestion des erreurs
  const bootstrap = () => bootstrapApplication(AppComponent, {
    providers: [
      ...appConfig.providers,
      provideServerRendering(),
      
      { provide: APP_BASE_HREF, useValue: '/' },
      { provide: 'document', useValue: '<!doctype html><html><head></head><body><app-root></app-root></body></html>' }
    ]
  });

  // Angular SSR route handler
  server.get('**', async (req, res, next) => {
    try {
      const html = await commonEngine.render({
        bootstrap,
        document: '<!doctype html><html><head></head><body><app-root></app-root></body></html>',
        url: req.originalUrl,
        publicPath: browserDistFolder,
      });
      res.send(html);
    } catch (err) {
      console.error('Erreur lors du rendu SSR :', err);
      next(err);
    }
  });

  return server;
}

function run(): void {
  const port = process.env["PORT"] || 4000;

  const server = app();

  if (useSSL && sslOptions) {
    https.createServer(sslOptions, server).listen(port, () => {
      console.log(`Secure server running on https://localhost:${port}`);
    });
  } else {
    http.createServer(server).listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}

if (typeof global.document === 'undefined') {
  (global as any).document = {
    createElement: () => ({ 
      style: {}, 
      appendChild: () => {}, 
      removeChild: () => {} 
    }),
    getElementById: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    body: {
      appendChild: () => {},
      removeChild: () => {}
    },
    head: {
      appendChild: () => {},
      removeChild: () => {}
    },
  };
}


run();
