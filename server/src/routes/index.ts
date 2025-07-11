/* Routes index file */
import { Router } from "express";
import path from "path";
import { clientPath } from "../app";

import userRoutes from "./user.routes";
import configRoutes from "./config.routes";
import compileRoutes from "./compile.routes";
import fileRoutes from "./files.routes";

const app = Router();

app.use("/users", userRoutes);
app.use("/config", configRoutes);
app.use("/doc", compileRoutes);
app.use("/files", fileRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Catch-all with filtering
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

export default app;
