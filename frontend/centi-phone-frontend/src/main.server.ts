import { renderApplication } from '@angular/platform-server';
import { provideServerRendering } from '@angular/platform-server';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { APP_BASE_HREF } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export default function render(opts: { document?: string; url: string }) {
  const bootstrap = () => bootstrapApplication(AppComponent, {
    providers: [
      ...appConfig.providers,
      provideServerRendering(),
     
      { provide: PLATFORM_ID, useValue: 'browser' },
     
    ],
  });

  return renderApplication(bootstrap, { 
    document: opts.document || '<!doctype html><html><head></head><body><app-root></app-root></body></html>',
    url: opts.url 
  });
}
