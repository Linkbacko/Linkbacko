// Protect window.fetch against "Cannot set property fetch of #<Window> which has only a getter"
if (typeof window !== 'undefined') {
  try {
    let currentFetch = window.fetch;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || !desc.set) {
      Object.defineProperty(window, 'fetch', {
        configurable: true,
        enumerable: true,
        get: () => currentFetch,
        set: (fn) => {
          currentFetch = fn;
        }
      });
    }
  } catch (_) {}
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
