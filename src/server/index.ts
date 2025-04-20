import express, { application, Express, Request, Response } from "express";
import { readFilesRecursively, compileDocument } from "./utils";
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

export const clientPath = path.join(__dirname, "public/");
export const folderPath = path.join(path.dirname(__dirname), inputdir);
export const outputPath = path.join(path.dirname(__dirname), docdir);

// Serve static files from the frontend
// MUST FIX: Avoid serving e.g. index.html if client is not in execution
app.use(express.static(clientPath));

// Serve input files from its directory
app.use("/input", express.static(folderPath));

// Serve result from a specific directory
app.use("/output", express.static(outputPath));

// Define routes before static file serving middleware
app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// Get input files (recursively)
app.get("/api/files", (req, res) => {
  try {
    const files = readFilesRecursively(folderPath);
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: "Error reading directory:\n", err });
  }
});

// Get a specific file
app.get("/api/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(folderPath, filename);

  // If file is visible in the directory, we can serve it (check err first)
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        res.status(500).json({ error: "Error while downloading the file" });
      }
    });
  });
});

// Create a new file
app.post("/api/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(folderPath, filename);

  // Check if the file already exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      return res.status(400).json({ error: "File already exists" });
    }
    // Create the file with empty content
    fs.writeFile(filePath, "", (err) => {
      if (err) {
        return res.status(500).json({ error: "Error while creating the file" });
      }
      res.json({ success: true, message: `${filename} created successfully` });
    });
  });
});

// Remove a file
app.delete("/api/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(folderPath, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Error while removing the file" });
    }
    res.json({ success: true, message: `${filename} removed successfully` });
  });
});

/*
Endpoint designed to update files in the input directory. Expected to receive an object with the following structure:
{ deletions: string[], updates: { filename: string, content: string }[], additions: { filename: string, content: string }[] }
*/
app.post("/api/files/update", (req, res) => {
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

app.get("/api/compile", (req, res) => {
  console.debug("Starting make process...");
  compileDocument(res);
});

// Specific route to serve the PDF file
app.get("/api/result", (req, res) => {
  res.sendFile(path.resolve(path.join(docdir, file)), (err) => {
    if (err) {
      console.error("Error while sending the file:", err);
      res.status(404).send("File not found");
    }
  });
});

app.listen(port, () => {
  // TODO: Remove unnecessary console logs and older PDF before starting
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
