import { Router } from "express";
import * as userController from "../controllers/User.Controller.js";

const userRouter: Router = Router();

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:userId", userController.getUserById);
userRouter.post("/", userController.createUser);

export default userRouter;
