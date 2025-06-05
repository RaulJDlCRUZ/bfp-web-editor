import { Request, Response } from "express";
import { createNewUser } from "@db/services/newUser/initNewUser.js";
import { exec } from "child_process";
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
    // Fetch the template, then create the new user with basic resources
    await fetchTemplate();
    createNewUser(userData, tfgData);
    res.status(200).json({ message: "New user created" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
