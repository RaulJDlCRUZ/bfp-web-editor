import express, { application, Express, Request, Response } from "express";
import {
  readFilesRecursivelyLegacy,
  getDirectoryTree,
  compileDocument,
} from "./utils";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";
import multer, { StorageEngine } from "multer";

dotenv.config({ override: true });

const app: Express = express();
const port = process.env.PORT || 5000;
const inputdir = process.env.INFILEPATH || "input";
const docdir = process.env.RESFILEPATH || "output";
const file = process.env.RESFILENAMEDEF || "tfgii.pdf";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const clientPath = path.join(__dirname, "public/");
export const folderPath = path.join(path.dirname(__dirname), inputdir);
export const outputPath = path.join(path.dirname(__dirname), docdir);

const storage: StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    // Use the original name of the file
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
}).single("file");

// Serve static files from the frontend
app.use(express.static(clientPath));

// Serve input files from its directory
app.use("/input", express.static(folderPath));

// Serve result from a specific directory
app.use("/output", express.static(outputPath));

// Define routes before static file serving middleware
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// Middleware to handle file uploads
app.post("/api/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: "Error uploading file" });
    }
    if (req.file) {
      console.log(`${req.file.filename} uploaded successfully`);
    } else {
      console.log("No file uploaded");
    }
    // console.log("Request body:", req.body);
    // File uploaded successfully
    return res.json({ success: true, message: "File uploaded successfully" });
  });
});

// Get input files (recursively)
app.get("/api/files", (req, res) => {
  try {
    const files = readFilesRecursivelyLegacy(folderPath);
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: "Error reading directory:\n", err });
  }
});

// Endpoint para devolver la estructura
app.get("/api/tree", (req, res) => {
  try {
    res.json(getDirectoryTree(folderPath));
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

// Update a file
app.patch("/api/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(folderPath, filename);
  const newContent = req.body.content;

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: `File ${filePath} not found` });
    }
    // Update the file with new content
    fs.writeFile(filePath, newContent, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error while updating the file" });
      }
      res.json({ success: true, message: `${filename} updated successfully` });
    });
  });
});

// Rename a file
app.put("/api/files/:oldFilename/:newFilename", (req, res) => {
  const oldFilename = req.params.oldFilename;
  const newFilename = req.params.newFilename;
  const oldFilePath = path.join(folderPath, oldFilename);
  const newFilePath = path.join(folderPath, newFilename);

  // Check if the file exists
  fs.access(oldFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }
    // Rename the file
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error while renaming the file" });
      }
      res.json({
        success: true,
        message: `${oldFilename} renamed to ${newFilename}`,
      });
    });
  });
});

// Move a file
app.post("/api/move", (req, res) => {
  const { oldPath, newPath } = req.body;
  const oldFilePath = path.join(folderPath, oldPath);
  const newFilePath = path.join(folderPath, newPath);

  // Check if the file exists
  fs.access(oldFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }
    // Move the file
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error while moving the file" });
      }
      res.json({ success: true, message: `${oldPath} moved to ${newPath}` });
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
