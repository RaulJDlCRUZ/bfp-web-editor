import { root, configPath } from "../app.js";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Fetches the template by executing a shell script.
 * The script is expected to be located at the specified path.
 * It overrides the existing template if the --override flag is provided.
 */
export async function fetchTemplate(): Promise<void> {
  const script = `${root}/fetchTemplate.sh`;
  try {
    const { stdout, stderr } = await execAsync(`sh ${script} --override`);
    if (stderr) {
      console.error(`[STDERR]:\n${stderr}`);
    }
    console.log(`[STDOUT]:\n${stdout}`);
    await removeUnusedCiteAttr();
  } catch (error) {
    console.error(`[ERR!]:\n${error}`);
    throw error;
  } finally {
    console.log("[Template fetch completed]");
  }
}

async function removeUnusedCiteAttr(): Promise<void> {
  try {
    const fileContent = await fs.promises.readFile(configPath, "utf-8"); // configPath includes filename
    const lines = fileContent.split("\n");
    if (lines.length > 0 && lines[0].startsWith("Cite:")) {
      lines.shift(); // Remove the first line
      await fs.promises.writeFile(configPath, lines.join("\n"), "utf-8");
      console.log("First line removed successfully.");
    } else {
      console.log("First line does not start with 'Cite:' or file is empty.");
    }
  } catch (error) {
    console.error(`Error processing the file: ${error}`);
    throw error;
  }
}
