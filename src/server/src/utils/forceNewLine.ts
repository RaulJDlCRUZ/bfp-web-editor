import fs from "fs";
import { execSync } from "child_process";

export function forceNewLine(filePath: string): void {
  try {
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      // sed -i -e '$a\' <FILE> Add a new line if it doesn't end with one
      execSync(`sed -i -e '$a\\' ${filePath}`, { stdio: "inherit" });
    }
  } catch (error) {
    console.error(`Error accessing file ${filePath}:`, error);
    return;
  }
}
