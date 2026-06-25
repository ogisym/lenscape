import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const path = window.location.pathname;
const root = document.getElementById("root");

// Ako je stranica pre-renderovana (statički HTML), hidriramo je.
// U dev modu (prazan #root) radimo običan render.
if (root.hasChildNodes()) {
  hydrateRoot(
    root,
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
} else {
  createRoot(root).render(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
