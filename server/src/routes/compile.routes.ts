import { Router } from "express";
import * as compileController from "../controllers/Compile.Controller.js";

const compileRouter: Router = Router();

compileRouter.get("/compile", compileController.compileDocument);
compileRouter.get("/result", compileController.sendResult);

export default compileRouter;
