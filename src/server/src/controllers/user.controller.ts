import { Request, Response } from "express";
import { exec } from "child_process";
import { User } from "@db/models/User.js";
import { TFG } from "@db/models/Tfg.js";
import {
  createNewUser,
  createNewTFG,
  initNewUser,
} from "@db/services/new_user_operations/initNewUser.js";
import { root } from "../index.js";

async function fetchTemplate(): Promise<void> {
  const script = `${root}/fetchTemplate.sh`;
  exec(`sh ${script} --override`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script:\n${error.message}`);
      throw error;
    }
    if (stderr) {
      console.error(`Script stderr:\n${stderr}`);
    }
    console.log(`Script stdout:\n${stdout}`);
  });
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
    initNewUser(user, tfg);
    res.status(200).json({ message: "New user created" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
