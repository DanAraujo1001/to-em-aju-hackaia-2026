// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import App from "./App.tsx";

// Registra o Service Worker com atualização automática
const updateSW = registerSW({
  onNeedRefresh() {
    // Quando há uma nova versão disponível, atualiza automaticamente
    updateSW(true);
  },
  onOfflineReady() {
    console.log("✅ Circuito Caju pronto para uso offline!");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
