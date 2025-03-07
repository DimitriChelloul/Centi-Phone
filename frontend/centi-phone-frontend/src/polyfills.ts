import 'zone.js';
import 'zone.js/plugins/zone-error'; 

// Import facultatif en développement pour déboguer les zones
if (process.env['NODE_ENV'] === 'development') {
  import('zone.js/plugins/zone-error');  // Garde cette ligne uniquement en développement
}

// Polyfill pour document sur le serveur
if (typeof document === 'undefined') {
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

if (typeof global !== 'undefined' && typeof (global as any).document === 'undefined') {
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



// Polyfill pour window sur le serveur si nécessaire
if (typeof window === 'undefined') {
  (global as any).window = {
    document: (global as any).document,
    location: {
      href: '',
      protocol: '',
      host: '',
    },
    navigator: { userAgent: 'SSR' },
    addEventListener: () => {},
    removeEventListener: () => {},
    setTimeout: () => {},
    clearTimeout: () => {},
    matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
  };
}

// Polyfill pour navigator si nécessaire
if (typeof navigator === 'undefined') {
  (global as any).navigator = { userAgent: 'SSR' };
}
