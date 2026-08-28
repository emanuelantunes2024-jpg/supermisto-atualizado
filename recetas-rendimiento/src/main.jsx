import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { StoreProvider } from './lib/StoreContext.jsx';
import { IdiomaProvider } from './lib/IdiomaContext.jsx';
import { AuthProvider } from './lib/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <IdiomaProvider>
          <StoreProvider>
            <App />
          </StoreProvider>
        </IdiomaProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
