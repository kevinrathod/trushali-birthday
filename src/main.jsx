import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';

// HashRouter keeps routes after a "#" (e.g. /#/game) so refreshing a page never 404s on GitHub Pages.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </HashRouter>
  </React.StrictMode>,
);
