import { Router } from "express";

import scoreResource from "@resources/score/score.resource";
import manageRequest from "@middlewares/manageRequest";

const scoresRouter = Router();

scoresRouter.patch("/:scoreID/update/leader-confirm", manageRequest(scoreResource.updateTeamLeaderConfirm));
scoresRouter.get("/branch/:branch", manageRequest(scoreResource.getBranchScores));
scoresRouter.get("/user/:userID", manageRequest(scoreResource.getUserScores));
scoresRouter.get("/team/:teamID", manageRequest(scoreResource.getTeamScores));
scoresRouter.get("/base/:baseID", manageRequest(scoreResource.getBaseScores));
scoresRouter.post("/create", manageRequest(scoreResource.createScore));
scoresRouter.get("/:scoreID", manageRequest(scoreResource.getScore));

export default scoresRouter;