import { Router } from "express";

import scoreResource from "@resources/score/score.resource";
import manageRequest from "@middlewares/manageRequest";
import hasAdmin from "@middlewares/hasAdmin";

const scoresRouter = Router();

scoresRouter.patch("/:scoreID/update/leader-confirm", manageRequest(scoreResource.updateTeamLeaderConfirm));
scoresRouter.post("/create", [hasAdmin], manageRequest(scoreResource.createScore));
scoresRouter.get("/user/:userID", manageRequest(scoreResource.getUserScores));
scoresRouter.get("/team/:teamID", manageRequest(scoreResource.getTeamScores));
scoresRouter.get("/base/:baseID", manageRequest(scoreResource.getBaseScores));
scoresRouter.get("/:scoreID", manageRequest(scoreResource.getScore));

export default scoresRouter;