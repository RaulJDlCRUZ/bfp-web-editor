import fs from "fs";
import yaml from "js-yaml";
import { configPath } from "../index.js";

import { Request, Response } from "express";

export async function getConfigFile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Read the config file
    const fileContents = fs.readFileSync(configPath, "utf8");
    try {
      // Parse the YAML content
      const config = yaml.load(fileContents) as Record<string, any>;
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

export async function updateConfigFile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const newConfig = req.body;

    // Read the existing config file
    const fileContents = fs.readFileSync(configPath, "utf8");
    const currentConfig = yaml.load(fileContents) as Record<string, any>;

    // Replace the current config with the new config
    const updatedConfig = { ...currentConfig, ...newConfig };

    // Write the updated config back to the file
    const yamlString = yaml.dump(updatedConfig);
    fs.writeFileSync(configPath, yamlString, "utf8");

    res.status(200).json({ message: "Config file updated successfully" });
  } catch (error) {
    console.error("Error updating config file:", error);
    res.status(500).json({ error: "Failed to update config file" });
  }
}
