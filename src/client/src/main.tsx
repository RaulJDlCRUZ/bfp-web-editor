import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import BasicCompilePage from "./pages/BasicCompilePage";
import CompilePagev2 from "./pages/CompilePagev2";
import CompilePagev3 from "./pages/CompilePagev3";
import CompilePagev4 from "./pages/CompilePagev4";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<CompilePagev4 />} />
          <Route path="/v2" element={<CompilePagev2 />} />
          <Route path="/v3" element={<CompilePagev3 />} />
          <Route path="/legacy" element={<BasicCompilePage />} />
        </Routes>
      </App>
    </BrowserRouter>
  </StrictMode>
);
