import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import BasicCompilePage from "@/views/pages/BasicCompilePage";
import CompilePagev2 from "@/views/pages/CompilePagev2";
import CompilePagev3 from "@/views/pages/CompilePagev3";
import CompilePagev4 from "@/views/pages/CompilePagev4";
import NewUserForm from "@/views/pages/NewUser";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<CompilePagev4 />} />
          <Route path="/new-user" element={<NewUserForm />} />
          <Route path="/legacy" element={<BasicCompilePage />} />
          <Route path="/v2" element={<CompilePagev2 />} />
          <Route path="/v3" element={<CompilePagev3 />} />
        </Routes>
      </App>
    </BrowserRouter>
  </StrictMode>
);
