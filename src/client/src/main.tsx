import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import BasicCompilePage from "./pages/BasicCompilePage";
import CompilePagev2 from "./pages/CompilePagev2";
import CompilePagev2a from "./pages/CompilePagev2a";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<CompilePagev2 />} />
          <Route path="/a" element={<CompilePagev2a />} />
          <Route path="/legacy" element={<BasicCompilePage />} />
        </Routes>
      </App>
    </BrowserRouter>
  </StrictMode>
);
