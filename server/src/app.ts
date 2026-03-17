/* ExpressJS Configuration */
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import routes from "./routes";

dotenv.config({ override: true });

const app: express.Application = express();
export const inputdir = process.env.INFILEPATH || "input";
export const docdir = process.env.RESFILEPATH || "output";

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const root =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, "..", "..", ".") // TODO: REVISAR ESTE COMPORTAMIENTO
    : path.resolve(__dirname, "..", "..");
export const folderPath = path.join(root, inputdir);
export const outputPath = path.join(root, docdir);
export const configPath = path.join(folderPath, "..", "config.yaml");
export const clientPath = path.join(root, "/dist/public/");

// Static Files (frontend and input images respectively)
app.use(express.static(clientPath));
app.use(
  "/images",
  express.static(path.join(folderPath, "resources", "images"))
);

// Rutas de API
app.use("/api", routes);

export default app;
