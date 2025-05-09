import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import multer, { StorageEngine } from "multer";
import { folderPath } from "../index.js";

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

/* Función recursiva para construir el árbol de directorios */
function getDirectoryTree(dirPath: string): any {
  const stats = fs.statSync(dirPath);
  const name = path.basename(dirPath);

  if (stats.isDirectory()) {
    const children = fs
      .readdirSync(dirPath)
      .map((child) => getDirectoryTree(path.join(dirPath, child)));
    return {
      name,
      nodetype: "directory",
      children,
    };
  } else {
    return {
      name,
      nodetype: "file",
      size: stats.size,
      filetype: path.extname(name).slice(1), // Remove the dot
      path: path.relative(folderPath, dirPath),
    };
  }
}

export function getAllFiles(req: Request, res: Response) {
  try {
    res.json(getDirectoryTree(folderPath));
  } catch (err) {
    res.status(500).json({ error: "Error reading directory:\n", err });
  }
}

export function uploadFile(req: Request, res: Response) {
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
}

export function renameFile(req: Request, res: Response) {
  const oldFile = req.body.oldFile; // path
  const newFilename = req.body.newFilename;
  const oldFilePath = path.join(folderPath, oldFile);
  const newFilePath = path.join(folderPath, oldFile, "..", newFilename);

  // Check if the file exists
  fs.access(oldFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: `File ${oldFile} not found` });
    }
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
}

export function moveFile(req: Request, res: Response) {
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
}

export function makeDirectory(req: Request, res: Response) {
  const dirName = req.body.name;
  const basepath = req.body.path ? req.body.path : "./";
  const dirPath = path.join(folderPath, basepath, dirName);

  // Check if the directory already exists
  fs.access(dirPath, fs.constants.F_OK, (err) => {
    if (!err) {
      return res.status(400).json({ error: "Directory already exists" });
    }
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error while creating the directory" });
      }
      res.json({ success: true, message: `${dirName} created successfully` });
    });
  });
}

export function createFile(req: Request, res: Response) {
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
}

export function getFile(req: Request, res: Response) {
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
}

export function updateFile(req: Request, res: Response) {
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
    fs.writeFile(filePath, newContent, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error while updating the file" });
      }
      res.json({ success: true, message: `${filePath} updated successfully` });
    });
  });
}

export function deleteFile(req: Request, res: Response) {
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
}

export function deleteDirectory(req: Request, res: Response) {
  const dirPath = path.join(folderPath, req.params[0]);

  // Check if the directory exists
  fs.access(dirPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "Directory not found" });
    }
    // Remove the directory and its contents
    fs.rmdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error while removing the directory" });
      }
      res.json({ success: true, message: `${dirPath} removed successfully` });
    });
  });
}
