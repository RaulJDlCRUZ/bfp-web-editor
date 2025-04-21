import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { Response } from "express";
import { folderPath } from "./index";

export function compileDocument(res: Response) {
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
    res.json({ result: "Compiled successfully!", pdf: "/api/result" });
  });

  proc.on("error", (error) => {
    console.error("Error while executing make:", error);
    res.status(500).json({ error: (error as Error).message });
  });
}

export function readFilesRecursivelyLegacy(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(readFilesRecursivelyLegacy(filePath));
    } else {
      results.push(path.relative(folderPath, filePath));
    }
  });

  return results;
}

// Función recursiva para construir la jerarquía
export function getDirectoryTree(dirPath: string): any {
  const stats = fs.statSync(dirPath);
  const name = path.basename(dirPath);

  if (stats.isDirectory()) {
    const children = fs.readdirSync(dirPath).map(child =>
      getDirectoryTree(path.join(dirPath, child))
    );
    return {
      name,
      nodetype: 'directory',
      children
    };
  } else {
    return {
      name,
      nodetype: 'file',
      size: stats.size,
      filetype: path.extname(name).slice(1), // Remove the dot
      path: path.relative(folderPath, dirPath)
    };
  }
}