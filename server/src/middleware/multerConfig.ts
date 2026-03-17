import { folderPath } from "../app";
import { RequestHandler } from "express";
import multer, { StorageEngine, diskStorage } from "multer";

/**
 * Middleware to handle file uploads.
 * This middleware uses multer to store files in the specified folderPath.
 * The uploaded file will be stored with its original name.
 * The maximum file size allowed is 10 MB.
 */

const storage: StorageEngine = diskStorage({
  destination: function (req, file, cb) {
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    // Use the original name of the file
    cb(null, file.originalname);
  },
});

const upload: RequestHandler = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
}).single("file");

export default upload;
