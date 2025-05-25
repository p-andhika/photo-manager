import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { Route } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
