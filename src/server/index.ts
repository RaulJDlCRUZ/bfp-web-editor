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

// Rename a file
app.put("/api/files/rename", (req, res) => {
  const oldFile = req.body.oldFile; // path
  const newFilename = req.body.newFilename;
  const oldFilePath = path.join(folderPath, oldFile);
  const newFilePath = path.join(folderPath, oldFile, "..", newFilename);

  // Check if the file exists
  fs.access(oldFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: `File ${oldFile} not found` });
    }
    // Rename the file
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: `Error while renaming the file: ${err}` });
      }
      res.json({
        success: true,
        message: `${oldFile} renamed to ${newFilename}`,
      });
    });
  });
});

// Move a file
app.post("/api/files/move", (req, res) => {
  const oldPath = req.body.oldPath; // path
  const newPath = req.body.newPath; // path (without filename to distinguish with rename)
  const oldFilePath = path.join(folderPath, oldPath);
  const newFilePath = path.join(folderPath, newPath);

  // Check if the file exists
  fs.access(oldFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }
    // Move the file (check if the destination is a directory)
    const finalNewFilePath = fs.lstatSync(newFilePath).isDirectory()
      ? path.join(newFilePath, path.basename(oldPath))
      : newFilePath;

    fs.rename(oldFilePath, finalNewFilePath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error while moving the file" });
      }
      res.json({
        success: true,
        message: `${oldPath} moved to ${finalNewFilePath}`,
      });
    });
  });
});

// Create a new directory
app.post("/api/files/create-directory", (req, res) => {
  const dirName = req.body.name;
  const basepath = req.body.path ? req.body.path : "./";
  const dirPath = path.join(folderPath, basepath, dirName);

  // Check if the directory already exists
  fs.access(dirPath, fs.constants.F_OK, (err) => {
    if (!err) {
      return res.status(400).json({ error: "Directory already exists" });
    }
    // Create the directory
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error while creating the directory" });
      }
      res.json({ success: true, message: `${dirName} created successfully` });
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

// Get a specific file (supports nested paths)
app.get("/api/files/*", (req, res) => {
  const filePath = path.join(
    folderPath,
    // accessing the first parameter of the wildcard ("0"), treated as a string both key and value
    (req.params as { [key: string]: string })[0]
  );

  // If file is visible in the directory, we can serve it (check err first)
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        res.status(500).json({ error: "Error while downloading the file" });
      }
    });
  });
});

// Update a file
app.patch("/api/files/*", (req, res) => {
  const filePath = path.join(
    folderPath,
    // accessing the first parameter of the wildcard ("0"), treated as a string both key and value
    (req.params as { [key: string]: string })[0]
  );
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
      res.json({ success: true, message: `${filePath} updated successfully` });
    });
  });
});

// Remove a file
app.delete("/api/files/*", (req, res) => {
  const filePath = path.join(
    folderPath,
    // accessing the first parameter of the wildcard ("0"), treated as a string both key and value
    (req.params as { [key: string]: string })[0]
  );

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Error while removing the file" });
    }
    res.json({ success: true, message: `${filePath} removed successfully` });
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

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Catch-all with filtering
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.listen(port, () => {
  // TODO: Remove unnecessary console logs and older PDF before starting
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
