import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import { parseMarkdownFile } from "../services/parse/markdownParser";

// REFACTORIZAR PARA MOVER ESTO A CONTROLADORES Y LUEGO DECIRLE AL MODELO LO QUE DEBE INSERTAR

export async function readChapters(
  ch_path: string
): Promise<Array<Record<number, any>>> {
  // As It's a setup, I consider and obtain all chapters
  const files = await fs.readdir(ch_path);
  const chapters: Array<Record<number, any>> = [];
  for (const file of files) {
    const number = parseInt(
      path.basename(file, path.extname(file)).slice(0, 2)
    );
    if (file.endsWith(".md")) {
      const content = await fs.readFile(path.join(ch_path, file), "utf-8");
      const data = parseMarkdownFile(content);
      // Store the chapter data in the object with its number as key
      // chapters[number] = data;
      const chapterRecord: Record<string, any> = {
        number: number,
        data: data,
      };
      chapters.push(chapterRecord);
    }
  }
  return chapters;
}

export async function readAppendices(
  ap_path: string
): Promise<Array<Record<number, any>>> {
  // Same as chapters, but for appendices
  const files = await fs.readdir(ap_path);
  const appendices: Array<Record<number, any>> = [];
  for (const file of files) {
    const number = parseInt(
      path.basename(file, path.extname(file)).slice(0, 2)
    );
    if (file.endsWith(".md")) {
      const content = await fs.readFile(path.join(ap_path, file), "utf-8");
      const data = parseMarkdownFile(content);
      // appendices[number] = data;
      const appendixRecord: Record<string, any> = {
        number: number,
        data: data,
      };
      appendices.push(appendixRecord);
    }
  }
  return appendices;
}

export async function readSetupFiles(
  dir: string
): Promise<Record<string, any>> {
  const basicInfo: Record<string, any> = {};
  // In alphabetical order
  const files = await fs.readdir(dir);
  for (const file of files) {
    if (file.endsWith(".md")) {
      const content = await fs.readFile(path.join(dir, file), "utf-8");
      // Store the setup file data in the object with its name as key
      basicInfo[file.split(".")[0]] = content;
    } else {
      // If it's not a markdown file, we can skip it or handle it differently
      console.warn(`Skipping non-markdown file: ${file}`);
    }
  }
  return basicInfo;
}

export async function readConfigFile(
  dir: string
): Promise<Record<string, any>> {
  let config: Record<string, any> = {};
  try {
    const content = await fs.readFile(path.join(dir, "config.yaml"), "utf-8");
    // First, we need to remove the "Cite: " line if it exists
    const lines = content
      .split("\n")
      .filter((line) => !line.startsWith("Cite:"));
    // Then, we can parse the remaining lines as YAML
    const filteredContent = lines.join("\n");
    config = yaml.load(filteredContent) as Record<string, any>;
    await fs.writeFile(path.join(dir, "config.yaml"), filteredContent, "utf-8");
  } catch (error) {
    console.error("Error reading or parsing config file:", error);
    // Handle the error as needed, e.g., return an empty object or throw an error
    config = {};
  } finally {
    return config;
  }
}

export async function readResources(
  res_path: string
): Promise<Array<Record<string, any>>> {
  let resources: Array<Record<string, any>> = [];
  const files = await fs.readdir(res_path);
  for (const file of files) {
    const filePath = path.join(res_path, file);
    try {
      const content = await fs.readFile(filePath);
      // resources[file] = content; // Store the raw binary content of the file
      const imageRecord: Record<string, any> = {
        file: file,
        content: content,
      };
      resources.push(imageRecord);
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  }

  return resources;
}
