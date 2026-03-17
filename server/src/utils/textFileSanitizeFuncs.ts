// import fs from "fs";
import fs from "fs/promises";

import { execSync } from "child_process";
import { configPath } from "../app.js";

export async function forceNewLine(filePath: string): Promise<void> {
  try {
    const stats = await fs.stat(filePath);
    if (stats.isFile()) {
      // sed -i -e '$a\' <FILE> Add a new line if it doesn't end with one
      execSync(`sed -i -e '$a\\' ${filePath}`, { stdio: "inherit" });
    }
  } catch (error) {
    console.error(`Error accessing file ${filePath}:`, error);
    return;
  }
}

export async function noCiteFiltering(): Promise<string> {
  const fileContents = await fs.readFile(configPath, "utf8");
  const lines = fileContents
    .split("\n")
    .filter((line) => !line.startsWith("Cite:"));
  const filteredContent = lines.join("\n");
  return filteredContent;
}
