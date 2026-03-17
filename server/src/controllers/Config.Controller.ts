import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { configPath, folderPath } from "../app.js";
// import { noCiteFiltering } from "../utils/textFileSanitizeFuncs.js";

// export async function getConfigFile(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   const filecontents = noCiteFiltering();
//   if (!filecontents) {
//     res.status(404).json({ error: "Config file not found or empty" });
//     return;
//   }
//   try {
//     // Parse the YAML content
//     const config = JSON.parse(filecontents) as Record<string, any>;
//     res.status(200).json(config);
//   } catch (yamlError) {
//     console.error("YAML parsing error:", yamlError);
//     res.status(400).json({ error: "Invalid YAML format in config file" });
//   }
// }

export async function getConfigFile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Read the config file
    const fileContents = fs.readFileSync(configPath, "utf8");
    const lines = fileContents
      .split("\n")
      .filter((line) => !line.startsWith("Cite:"));
    // Then, we can parse the remaining lines as YAML
    const filteredContent = lines.join("\n");
    try {
      // Parse the YAML content
      const config = yaml.load(filteredContent) as Record<string, any>;
      res.status(200).json(config);
    } catch (yamlError) {
      console.error("YAML parsing error:", yamlError);
      res.status(400).json({ error: "Invalid YAML format in config file" });
    }
  } catch (error) {
    console.error("Error reading config file:", error);
    res.status(500).json({ error: "Failed to read config file" });
  }
}

export function getCfgFileAsNode(_: Request, res: Response): void {
  try {
    const configPath = path.join(folderPath, "..", "config.yaml");
    console.log("Config Path:", configPath);
    // Check if the config file exists
    fs.access(configPath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: "Config file not found" });
      }
      const stats = fs.statSync(configPath);
      const flname = path.basename(configPath);
      // Read the config file
      fs.readFile(configPath, "utf8", (err) => {
        if (err) {
          return res.status(500).json({ error: "Error reading config file" });
        }
        try {
          // Create a node object
          const node = {
            name: "config.yaml",
            path: flname,
            nodetype: "file",
            filetype: path.extname(flname).slice(1), // Remove the dot
            size: stats.size,
            friendlyname: "",
            order: null,
          };
          res.status(200).json(node); // Send the node as a response
        } catch (parseErr) {
          res.status(500).json({ error: "Error creating config file as node" });
        }
      });
    });
  } catch (error) {
    console.error("Error in getCfgFileAsNode:", error);
    res.status(500).json({ error: "Failed to process config file as node" });
  }
}

export async function updateConfigFile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.body || !req.body.config) {
      res
        .status(400)
        .json({ error: "Invalid request body or missing 'config' property" });
    }
    const newConfig = req.body.config as Record<string, any>;
    // console.log("New Config:\n", newConfig);
    // Read the existing config file
    const fileContents = fs.readFileSync(configPath, "utf8");
    const currentConfig = yaml.load(fileContents) as Record<string, any>;

    // Replace the current config with the new config
    const updatedConfig = { ...currentConfig, ...newConfig };

    // Write the updated config back to the file
    const yamlString = yaml.dump(updatedConfig);
    fs.writeFileSync(configPath, yamlString, "utf8");

    console.log("Config file updated successfully");
    res.status(200).json({ message: "Config file updated successfully" });
  } catch (error) {
    console.error("Error updating config file:", error);
    res.status(500).json({ error: "Failed to update config file" });
  }
}
