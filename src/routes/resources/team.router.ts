import { Router } from "express";

import teamResource from "@resources/team/team.resource";
import manageRequest from "@middlewares/manageRequest";
import hasAdmin from "@middlewares/hasAdmin";

const teamsRouter = Router();

teamsRouter.delete("/:teamID/delete", [hasAdmin], manageRequest(teamResource.deleteTeam));
teamsRouter.patch("/:teamID/update", [hasAdmin], manageRequest(teamResource.updateTeam));
teamsRouter.post("/create", [hasAdmin], manageRequest(teamResource.createTeam));
teamsRouter.get("/user/:userID", manageRequest(teamResource.getUserTeams));
teamsRouter.get("/code/:code", manageRequest(teamResource.getTeamByCode));
teamsRouter.get("/:teamID", manageRequest(teamResource.getTeam));
teamsRouter.get("/", manageRequest(teamResource.getAllTeams));

export default teamsRouter;