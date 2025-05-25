import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes } from "react-router";
import { Route } from "react-router";

import { Home } from "./pages/home";
import { Detail } from "./pages/detail";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="detail" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
