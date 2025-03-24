import { Router } from "express";

import baseResource from "@resources/base/base.resource";
import manageRequest from "@middlewares/manageRequest";
import hasAdmin from "@middlewares/hasAdmin";

const basesRouter = Router();

basesRouter.delete("/:baseID/delete", [hasAdmin], manageRequest(baseResource.deleteBase));
basesRouter.patch("/:baseID/update", [hasAdmin], manageRequest(baseResource.updateBase));
basesRouter.post("/create", [hasAdmin], manageRequest(baseResource.createBase));
basesRouter.get("/user/:userID", manageRequest(baseResource.getUserBases));
basesRouter.get("/:baseID", manageRequest(baseResource.getBase));
basesRouter.get("/", manageRequest(baseResource.getAllBases));

export default basesRouter;