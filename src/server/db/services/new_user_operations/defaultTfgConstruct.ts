import fs from "fs/promises";
import {
  readChapters,
  readAppendices,
  readConfigFile,
  readResources,
  readSetupFiles,
} from "@db/utils/fileReader.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* This function creates a TFG from scratch (taking the basic template resources) */
export async function constructTFG(): Promise<any> {
  const infilepath = process.env.INFILEPATH || "input";
  const root =
    process.env.NODE_ENV === "development"
      ? path.resolve(path.dirname(__dirname), "..", "..", "..", "..")
      : path.resolve(path.dirname(__dirname), "..", "..", "..");

  const tfggii_dir = path.join(root, infilepath);
  const chapters_path = path.join(tfggii_dir, "chapters");
  const appendices_path = path.join(tfggii_dir, "appendices");
  const resources_path = path.join(tfggii_dir, "resources", "images");
  const bib_path = path.join(tfggii_dir, "resources", "bibliography");
  const config_path = path.join(tfggii_dir, "..");

  const chapters = await readChapters(chapters_path);
  const appendices = await readAppendices(appendices_path);
  const setupFiles = await readSetupFiles(tfggii_dir);
  const resources = await readResources(resources_path);
  const config = await readConfigFile(config_path);
  const bibliography = await fs.readFile(
    path.join(bib_path, "bibliography.bib"),
    "utf-8"
  );

  // Return the data as an object
  return {
    chapters,
    appendices,
    setupFiles,
    resources,
    config,
    bibliography,
  };
}
