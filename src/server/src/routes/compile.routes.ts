import { Router } from "express";
import * as compileController from "../controllers/compile.controller.js";

const compileRouter: Router = Router();

compileRouter.get("/compile", compileController.compileDocument);
compileRouter.get("/result", compileController.sendResult);

export default compileRouter;
