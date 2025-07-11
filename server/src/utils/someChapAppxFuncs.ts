import fs from "fs";
import path from "path";
import { folderPath } from "../app.js";

/**
 * Obtains highest number from files in a specific subfolder.
 * This function checks the specified subfolder for files that start with a two-digit number,
 * and returns the next available number that can be used for a new file. Maybe deprecated by DB
 * @param subfolder "appendices" | "chapters"
 * @returns The next available chapter or appendix number, or null if no files exist (or err).
 */

type Subfolder = "appendices" | "chapters";
type modeComm = "comment" | "uncomment";

export function checkLastChapOrAppx(subfolder: Subfolder): number | null {
  const targetFolder = path.join(folderPath, subfolder);
  if (!fs.existsSync(targetFolder)) {
    throw new Error(`Folder does not exist: ${targetFolder}`);
  }

  const files = fs.readdirSync(targetFolder);
  const numbers = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const prefix = file.slice(0, 2);
      return prefix !== "XX" ? parseInt(prefix, 10) : NaN;
    })
    .filter((num) => !isNaN(num))
    .sort((a, b) => a - b);

  for (let i = 1; i <= numbers.length; i++) {
    if (!numbers.includes(i)) {
      return i;
    }
  }

  return numbers.length > 0 ? Math.max(...numbers) + 1 : null;
}

/**
 * Extracts the order number from a filename.
 * @param filename Filename from which to extract the order number.
 * @returns The order number extracted from the filename.
 */
export function extractOrder(filename: string): number {
  const slice: string = filename.slice(0, 2);
  if (slice === "XX") return 0;
  const order: number = parseInt(slice, 10);
  if (isNaN(order)) return 0;
  // console.log("ORDER->", filename, slice, order);
  return 10 * order;
}

/**
 *
 */
export function addPrefixToFilename(
  filename: string,
  mode: modeComm,
  dest: Subfolder
): string {
  if (mode === "comment") {
    // For comments, replace the first two characters of the filename with "XX"
    return `XX${filename.slice(2)}`;
  }

  // Check the last chapter or appendix number
  let prefix: string[2] = "XX";
  let last = checkLastChapOrAppx(dest);

  switch (last) {
    case null:
      prefix = "01"; // If no chapters or appendices exist, start with 01
      break;
    default:
      prefix = last < 10 ? `0${last}` : `${last}`; // Ensure two-digit format
      break;
  }

  return `${prefix}${filename.slice(2)}`;
}

/**
 * Extracts a friendly name from the file data. Exactly, checks for first level section name, as Chapter/Appendix name
 * @param filedata The content of the file as a string.
 * @returns The friendly name extracted from the file data, or an empty string if not found.
 */
export function getFriendlyName(filedata: any): string {
  const begin_html_comment = "<!--";
  const end_html_comment = "-->";
  const chapter_wildcard = "# ";

  const lines = filedata.split("\n");
  let isCommented = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith(begin_html_comment)) {
      isCommented = true;
    }

    if (trimmedLine.endsWith(end_html_comment)) {
      isCommented = false;
      continue;
    }

    if (!isCommented && trimmedLine.startsWith(chapter_wildcard)) {
      const chapterName = trimmedLine.slice(chapter_wildcard.length).trim();
      return chapterName;
    }
  }
  return "";
}

/**
 * Recursive function to create a tree structure from a directory.
 * @param dirPath The path to the directory to be converted into a tree structure.
 * @returns A complex object representing the directory structure, including files and subdirectories.
 */
export function makeDirectoryTree(dirPath: string): any {
  const stats = fs.statSync(dirPath);
  const name = path.basename(dirPath);

  if (stats.isDirectory()) {
    const children = fs
      .readdirSync(dirPath)
      .map((child) => makeDirectoryTree(path.join(dirPath, child)));
    return {
      name,
      path: "input/" + path.relative(folderPath, dirPath),
      nodetype: "directory",
      children,
    };
  } else {
    let friendlyName: string | null = null;
    let priorityOrder: number | null = null;
    if (
      dirPath.includes("chapters") ||
      (dirPath.includes("appendices") && dirPath.endsWith(".md"))
    ) {
      // Only reading chapters or appendices
      const filedata = fs.readFileSync(dirPath, "utf8");
      friendlyName = getFriendlyName(filedata);
      priorityOrder = extractOrder(name);
    }
    return {
      name,
      path: "input/" + path.relative(folderPath, dirPath),
      nodetype: "file",
      filetype: path.extname(name).slice(1), // Remove the dot
      size: stats.size,
      friendlyname: friendlyName,
      order: priorityOrder,
    };
  }
}
