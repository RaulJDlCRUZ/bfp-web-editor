import express from "express";
import dotenv, { config } from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import fileRoutes from "./routes/files.routes.js";
import compileRoutes from "./routes/compile.routes.js";
import configRoutes from "./routes/config.routes.js";
import { removeOldDoc } from "./utils/removeOldDoc.js";

dotenv.config({ override: true });

const app = express();
const port = process.env.PORT || 5000;
const inputdir = process.env.INFILEPATH || "input";
const docdir = process.env.RESFILEPATH || "output";
const file = process.env.RESFILENAMEDEF || "tfgii.pdf";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const root =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, "..", "..", "..")
    : path.resolve(__dirname, "..", "..");
export const folderPath = path.join(root, inputdir);
export const outputPath = path.join(root, docdir);
export const configPath = path.join(folderPath, "..", "config.yaml");
export const clientPath = path.join(root, "/dist/public/");

// Serve static files from the frontend
app.use(express.static(clientPath));

// Serve input files from its directory
app.use("/input", express.static(folderPath));

// Serve result from a specific directory
app.use("/output", express.static(outputPath));

// Serve the app config
// app.use("/config", express.static(configPath));

// Serve input images from its directory
app.use(
  "/images",
  express.static(path.join(folderPath, "resources", "images"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.use("/api/files", fileRoutes);
app.use("/api/doc", compileRoutes);
app.use("/config", configRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Catch-all with filtering
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.listen(port, () => {
  removeOldDoc(outputPath, file);
  if (process.env.NODE_ENV === "development") {
    console.log(`[server]: PROJECT ROOT: ${root}`);
    console.log(`[server]: Input files are served from ${folderPath}`);
    console.log(`[server]: Output files are served from ${outputPath}`);
    console.log(`[server]: Client path ${clientPath}`);
    console.log(`[server]: Makefile path is ${process.env.MAKEPATH}`);
    console.log(`[server]: Makefile name is ${file}`);
  }
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
