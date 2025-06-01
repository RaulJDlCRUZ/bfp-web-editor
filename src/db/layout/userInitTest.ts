import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { parseMarkdownFile } from "./markdownParser";
// import Pool from "../pool";

dotenv.config({ override: true });

async function readChapters(ch_path: string): Promise<Record<string, any>> {
  // As It's a setup, I consider and obtain all chapters
  const files = await fs.readdir(ch_path);
  const chapters: Record<string, any> = {};
  for (const file of files) {
    const number = parseInt(
      path.basename(file, path.extname(file)).slice(0, 2)
    );
    if (file.endsWith(".md")) {
      const content = await fs.readFile(path.join(ch_path, file), "utf-8");
      const data = parseMarkdownFile(content);
      // Store the chapter data in the object with its number as key
      chapters[number] = data;
    }
  }
  return chapters;
}

async function readAppendices(ap_path: string): Promise<Record<string, any>> {
  // Same as chapters, but for appendices
  const files = await fs.readdir(ap_path);
  const appendices: Record<string, any> = {};
  for (const file of files) {
    const number = parseInt(
      path.basename(file, path.extname(file)).slice(0, 2)
    );
    if (file.endsWith(".md")) {
      const content = await fs.readFile(path.join(ap_path, file), "utf-8");
      const data = parseMarkdownFile(content);
      appendices[number] = data;
    }
  }
  return appendices;
}

async function readSetupFiles(dir: string): Promise<Record<string, any>> {
  const setupFiles: Record<string, any> = {};
  // In alphabetical order
  return setupFiles;
}

async function readResources(res_path: string): Promise<Record<string, any>> {
  const resources: Record<string, any> = {};
  // First bibliography, then, images
  return resources;
}

export async function initializeUserData(userId: number) {
  const infilepath = process.env.INFILEPATH || "input";
  const root =
    process.env.NODE_ENV === "development"
      ? path.resolve(
          path.dirname(new URL(import.meta.url).pathname),
          "..",
          "..",
          ".."
        )
      : // : path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
        path.resolve(
          path.dirname(new URL(import.meta.url).pathname),
          "..",
          "..",
          ".." // For npx tsx testing, at reallity it's 2 levels up
        );

  const tfggii_dir = path.join(root, infilepath);
  const chapters_path = path.join(tfggii_dir, "chapters");
  const appendices_path = path.join(tfggii_dir, "appendices");
  const resources_path = path.join(tfggii_dir, "resources");

  // Read chapters
  const chapters = await readChapters(chapters_path);
  const appendices = await readAppendices(appendices_path);
  const setupFiles = await readSetupFiles(tfggii_dir);
  const resources = await readResources(resources_path);

  console.log("Parsed chapters\n==========\n", chapters);
}

initializeUserData(1).then(() =>
  console.log("Testing parsing implementation...")
);
