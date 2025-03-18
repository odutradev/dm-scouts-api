import { Router } from "express";

import adminResource from "@resources/admin/admin.resource";
import manageRequest from "@middlewares/manageRequest";

const adminRouter = Router();

adminRouter.delete("/users/delete/:userID", manageRequest(adminResource.deleteUser));
adminRouter.patch("/users/update/:userID", manageRequest(adminResource.updateUser));
adminRouter.post("/users/create", manageRequest(adminResource.createUser));
adminRouter.get("/users/:userID", manageRequest(adminResource.getUser));
adminRouter.get("/users", manageRequest(adminResource.getAllUsers));

export default adminRouter;