import { root } from "../app.js";
import { exec } from "child_process";
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
  } catch (error) {
    console.error(`[ERR!]:\n${error}`);
    throw error;
  } finally {
    console.log("[Template fetch completed]");
  }
}
