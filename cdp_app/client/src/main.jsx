import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { ContextsProvider } from './contexts/ContextsProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContextsProvider>
  </StrictMode>
);
