import { Router } from "express";

import baseResource from "@resources/base/base.resource";
import manageRequest from "@middlewares/manageRequest";

const basesRouter = Router();

basesRouter.delete("/:baseID/delete", manageRequest(baseResource.deleteBase));
basesRouter.patch("/:baseID/update", manageRequest(baseResource.updateBase));
basesRouter.get("/user/:userID", manageRequest(baseResource.getUserBases));
basesRouter.post("/create", manageRequest(baseResource.createBase));
basesRouter.get("/:baseID", manageRequest(baseResource.getBase));
basesRouter.get("/", manageRequest(baseResource.getAllBases));

export default basesRouter;