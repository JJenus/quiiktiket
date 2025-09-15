// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: (req) => {
      console.warn('MSW: Unhandled request:', req.method, req.url);
      return 'bypass';
    },
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}