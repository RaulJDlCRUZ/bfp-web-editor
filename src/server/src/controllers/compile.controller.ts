import { spawn } from "child_process";
import { Request, Response } from "express";
import path from "path";
import { folderPath, outputPath } from "../index.js";
import { forceNewLine } from "../utils/forceNewLine.js";

const file = process.env.RESFILENAMEDEF || "tfgii.pdf";

export function compileDocument(req: Request, res: Response) {
  // Before compiling, add new line to the acronyms file (PENDING TEMPLATE FIX)
  forceNewLine(path.join(folderPath, "acronyms.md"));
  console.debug("Starting make process...");
  const dir = process.env.MAKEPATH || "makefiles";
  const proc = spawn("make", [], {
    cwd: dir,
    shell: true,
  });

  proc.stdout.on("data", (data) => {
    const output = data.toString();
    console.debug(output);
  });

  proc.stderr.on("data", (data) => {
    const error = data.toString();
    console.error(error);
  });

  proc.on("close", (code) => {
    console.log(`make process finished with code: ${code}`);
    if (typeof res.redirect === "function") {
      res.status(200).json({
        result: "OK",
      });
    } else {
      console.error("res.redirect is not a function");
      res.status(500).send("Internal Server Error");
    }
  });

  proc.on("error", (error) => {
    console.error("Error while executing make:", error);
    res.status(500).json({ error: (error as Error).message });
  });
}

export function sendResult(req: Request, res: Response) {
  const pdfFilePath = path.resolve(path.join(outputPath, file));
  console.debug("Sending file:", pdfFilePath);
  /* Custom PDF header */
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(pdfFilePath, (err) => {
    if (err) {
      console.error("Error while sending the file:", err);
      res.status(404).send("File not found");
    }
  });
}
