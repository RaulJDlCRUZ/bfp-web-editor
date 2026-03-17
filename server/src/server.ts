/* Main entry point for the TWE server */
import app from "./app";
import pool from "../database/config/db.js";

import { folderPath, outputPath, clientPath, root } from "./app";

import { removeOldDoc } from "./utils/removeOldDoc.js";

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 5000;
const file = process.env.RESFILENAMEDEF || "tfgii.pdf";

app.listen(port, () => {
  removeOldDoc(outputPath, file);
  if (process.env.NODE_ENV === "development") {
    console.log(`[server]: Running in development mode`);
    console.log(`[server]: PROJECT ROOT: ${root}`);
    console.log(`[server]: Input files are served from ${folderPath}`);
    console.log(`[server]: Output files are served from ${outputPath}`);
    console.log(`[server]: Client path ${clientPath}`);
    console.log(`[server]: Makefile path is ${process.env.MAKEPATH}`);
    console.log(`[server]: Makefile name is ${file}`);
  }
  console.log(
    `[server]: Database connected at ${pool.options.host}:${pool.options.port}`
  );
  console.log(`[server]: TWE is running at http://${host}:${port}`);
});
