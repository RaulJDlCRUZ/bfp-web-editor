import express, { application, Express, Request, Response } from "express";
import { compileDocument } from "./compile";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config({ override: true });

const app: Express = express();
const port = process.env.PORT || 5000;
const docdir = process.env.RESFILEPATH || "output";
const file = process.env.RESFILENAMEDEF || "tfgii.pdf";

app.use(cors());

// Define routes before static file serving middleware
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "dist/", "public/", "index.html"));
});

app.get("/runcompilation", (req, res) => {
  console.debug("Starting make process...");
  compileDocument(res);
});

// Specific route to serve the PDF file
app.get("/servedoc", (req, res) => {
  res.sendFile(path.resolve(docdir) + "/" + file, (err) => {
    if (err) {
      console.error("Error while sending the file:", err);
      res.status(404).send("File not found");
    }
  });
});

// Serve static files from a specific directory (Middleware)
app.use("/result", express.static(path.join(__dirname, docdir)));

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, "../public")));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
