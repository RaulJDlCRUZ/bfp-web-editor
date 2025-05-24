import { Router } from "express";
import * as configController from "../controllers/config.controller.js";

const configRouter: Router = Router();

configRouter.get("/", configController.getConfigFile);
configRouter.patch("/", configController.updateConfigFile);

export default configRouter;
