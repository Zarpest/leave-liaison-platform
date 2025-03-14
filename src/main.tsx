
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Aseguramos que el elemento root existe
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se pudo encontrar el elemento root");
}

console.log("Iniciando la aplicación");

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
