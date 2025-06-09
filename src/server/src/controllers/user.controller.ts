import { Request, Response } from "express";
import { promisify } from "util";
import { exec } from "child_process";
import { User } from "@db/models/User.js";
import { TFG } from "@db/models/Tfg.js";
import {
  createNewUser,
  createNewTFG,
  initNewUser,
} from "@db/services/new_user_operations/initNewUser.js";
import { updateConfigFile } from "./config.controller.js";
import { root } from "../index.js";

// Promisify exec to use async/await
// This allows us to use exec in an async function without callbacks
const execAsync = promisify(exec);

/**
 * Fetches the template by executing a shell script.
 * The script is expected to be located at the specified path.
 * It overrides the existing template if the --override flag is provided.
 */
async function fetchTemplate(): Promise<void> {
  const script = `${root}/fetchTemplate.sh`;
  try {
    const { stdout, stderr } = await execAsync(`sh ${script} --override`);
    if (stderr) {
      console.error(`Script stderr:\n${stderr}`);
    }
    console.log(`Script stdout:\n${stdout}`);
  } catch (error) {
    console.error(`Error executing script:\n${error}`);
    throw error;
  }
}

export async function getAllUsers(res: Response) {
  res.status(501).json({ message: "Not implemented" });
}

export async function getUserById(req: Request, res: Response) {
  res.status(501).json({ message: "Not implemented" });
}

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { userData, tfgData } = req.body;
    if (!userData || !tfgData) {
      res.status(400).json({ message: "Missing userData or tfgData" });
    }
    const user: User = await createNewUser(userData);
    if (!user) {
      res.status(500).json({ message: "Failed to create user" });
      return;
    }
    if (!user.user_id || user.user_id < 0) {
      res.status(500).json({ message: "Failed to create user" });
      return;
    }
    // Fetch the template, then create the new user with basic resources
    await fetchTemplate();
    const tfg: TFG = await createNewTFG(user.user_id, tfgData);
    await initNewUser(user, tfg);
    // If everything is successful, update the config.yaml file

    const configData = {
      Cotutor: tfg.cotutor,
      Csl: `input/resources/csl/${tfg.csl}.csl`,
      Department: tfg.department,
      Language: String(tfg.language).toLowerCase(),
      Month:
        tfg.month.charAt(0).toUpperCase() + tfg.month.slice(1).toLowerCase(), // Capitalize first letter
      Name: user.name + " " + user.lastname1 + " " + user.lastname2,
      Technology: user.technology,
      Title: tfg.title,
      Subtitle: tfg.subtitle,
      Tutor: tfg.tutor,
      Year: String(tfg.year),
    };

    const tempRes = {
      status: (code: number) => ({
        json: (data: any) => {
          console.log(`Response before changing config: ${code}`, data);
        },
      }),
    } as unknown as Response;

    updateConfigFile(
      {
        body: { config: configData },
      } as Request,
      tempRes
    );

    res.status(200).json({ message: "New user created" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
