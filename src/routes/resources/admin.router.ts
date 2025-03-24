import { Router } from "express";

import adminResource from "@resources/admin/admin.resource";
import manageRequest from "@middlewares/manageRequest";

const adminRouter = Router();

adminRouter.patch("/users/:userID/update/password", manageRequest(adminResource.updateUserPassword));
adminRouter.delete("/users/:userID/delete/", manageRequest(adminResource.deleteUser));
adminRouter.patch("/users/:userID/update", manageRequest(adminResource.updateUser));
adminRouter.post("/users/create", manageRequest(adminResource.createUser));
adminRouter.get("/users/:userID", manageRequest(adminResource.getUser));
adminRouter.get("/users", manageRequest(adminResource.getAllUsers));

adminRouter.patch("/config/update", manageRequest(adminResource.updateConfig));
adminRouter.get("/config", manageRequest(adminResource.getConfig));

export default adminRouter;