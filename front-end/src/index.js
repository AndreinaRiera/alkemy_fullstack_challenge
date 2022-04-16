import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import './utils/propotypes';

import './styles/index-bootstrap.scss';

library.add(fas);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
