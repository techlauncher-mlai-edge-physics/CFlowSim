/* eslint-disable import/default */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

if (process.env.NODE_ENV === 'development') {
  // use axe for accessibility testing
  const axe = import('@axe-core/react');
  void axe.then((axe) => {
    void axe.default(React, ReactDOM, 1000);
  });
}
// eslint-disable-next-line import/no-named-as-default-member
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
