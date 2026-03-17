import { Request, Response } from "express";
// Models
import { User } from "../models/entities/User.js";
import { Tfg } from "../models/entities/Tfg.js";
import { UserFormData } from "../shared/types/UserFormData.js";
import { TfgFormData } from "../shared/types/TfgFormData.js";
// Services (domain logic)
import { UserService } from "../services/UserService.js";
import { UserTfgService } from "../services/UserTfgService.js";
// Auxiliary functions
import { validateUserFormData } from "../validators/UserValidator.js";
import { validateTfgFormData } from "../validators/TfgValidator.js";

type formData = {
  userData: UserFormData;
  tfgData: TfgFormData;
};

type responseData = {
  user: User;
  tfg: Tfg;
};

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const userService = new UserService();
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const userService = new UserService();
    const user = await userService.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

export async function getUserByEmail(req: Request, res: Response) {
  const email = req.params.email;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const userService = new UserService();
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ error: "Failed to fetch user by email" });
  }
}

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const reqData: formData = req.body;
    if (!reqData.userData || !reqData.tfgData) {
      res.status(400).json({ message: "Missing userData or tfgData" });
    }

    validateUserFormData(reqData.userData);
    validateTfgFormData(reqData.tfgData);

    const userTfgService = new UserTfgService();

    // Initialize the new user with the TFG
    const resData: responseData = await userTfgService.createUserWithTfg(
      reqData.userData,
      reqData.tfgData
    );

    if (!resData.user || !resData.tfg) {
      res.status(500).json({
        message: "Failed while creating new assets for new User and TFG",
      });
    }

    const user: User = resData.user;
    const tfg: Tfg = resData.tfg;

    res.status(201).json({ user, tfg });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user with TFG" });
  }
}
