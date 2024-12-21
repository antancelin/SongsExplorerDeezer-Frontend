// packages import
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// styles import
import "./styles/base/reset.css";
import "./styles/base/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
