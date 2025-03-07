import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import BasicCompilePage from "./pages/BasicCompilePage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<BasicCompilePage />} />
        </Routes>
      </App>
    </BrowserRouter>
  </StrictMode>
);
