import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import BasicCompilePage from "./pages/BasicCompilePage";
import CompilePagev2 from "./pages/CompilePagev2";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<BasicCompilePage />} />
          <Route path="/v2" element={<CompilePagev2 />} />
        </Routes>
      </App>
    </BrowserRouter>
  </StrictMode>
);
