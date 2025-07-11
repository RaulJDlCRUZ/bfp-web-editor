import { Router } from "express";
import * as configController from "../controllers/Config.Controller.js";

const configRouter: Router = Router();

configRouter.get("/node", configController.getCfgFileAsNode);
configRouter.get("/", configController.getConfigFile);
configRouter.patch("/", configController.updateConfigFile);

export default configRouter;
