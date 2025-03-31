import express, { application, Express, Request, Response } from "express";
import { compileDocument } from "./compile";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";

dotenv.config({ override: true });

const app: Express = express();
const port = process.env.PORT || 5000;
const inputdir = process.env.INFILEPATH || "input";
const docdir = process.env.RESFILEPATH || "output";
const file = process.env.RESFILENAMEDEF || "tfgii.pdf";

app.use(cors());
app.use(express.json());

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, "../public")));

// Serve input files from its directory
const folderPath = path.join(__dirname, inputdir);
app.use("/input", express.static(folderPath));

// Serve result from a specific directory
app.use("/result", express.static(path.join(__dirname, docdir)));

// Define routes before static file serving middleware
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "dist/", "public/", "index.html"));
});

// Get input files
app.get("/files", (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error al leer la carpeta" });
    }
    res.json({ files });
  });
});

/*
Endpoint designed to update files in the input directory. Expected to receive an object with the following structure:
{ deletions: string[], updates: { filename: string, content: string }[], additions: { filename: string, content: string }[] }
*/
app.post("/files/update", (req, res) => {
  const { deletions, updates, additions } = req.body;

  // Deletions
  if (deletions && Array.isArray(deletions)) {
    deletions.forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }

  // Updates
  if (updates && Array.isArray(updates)) {
    updates.forEach(({ filename, content }) => {
      const filePath = path.join(folderPath, filename);
      fs.writeFileSync(filePath, content, "utf8");
    });
  }

  // Additions
  if (additions && Array.isArray(additions)) {
    additions.forEach(({ filename, content }) => {
      const filePath = path.join(folderPath, filename);
      fs.writeFileSync(filePath, content, "utf8");
    });
  }

  // Then, we can compute functions with the updated files, such as compileDocument
  // compileDocument();
  res.json({ success: true });
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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
