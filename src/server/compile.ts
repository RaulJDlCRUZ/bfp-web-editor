import { spawn } from "child_process";
import { Response } from "express";

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
    res.json({ result: "Compiled successfully!", pdf: "/servedoc" });
  });

  proc.on("error", (error) => {
    console.error("Error while executing make:", error);
    res.status(500).json({ error: (error as Error).message });
  });
}
