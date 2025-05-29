import { Router } from "express";
import * as filesController from "../controllers/files.controller.js";

const filesRouter: Router = Router();

filesRouter.get("/", filesController.getAllFiles);
filesRouter.post("/upload", filesController.uploadFile);
filesRouter.put("/rename", filesController.renameFile);
filesRouter.post("/move", filesController.moveFile);
filesRouter.post("/mkdir", filesController.makeDirectory);
filesRouter.post("/rmdir", filesController.deleteDirectory);
filesRouter.post("/:filename", filesController.createFile);
filesRouter.get("*", filesController.getFile);
filesRouter.patch("*", filesController.updateFile);
filesRouter.delete("*", filesController.deleteFile);

export default filesRouter;
