import { Router } from "express";

import ticketsRouter from "./resources/tickets.router";
import controlAccess from "@middlewares/controlAccess";
import basesRouter from "./resources/bases.router";
import scoresRouter from "./resources/score.router";
import usersRouter from "./resources/users.router";
import adminRouter from "./resources/admin.router";
import teamsRouter from "./resources/team.router";
import hasAdmin from "@middlewares/hasAdmin";
import auth from "@middlewares/auth";

const router = Router();

router.get("/ping", (req, res) => {
    res.sendStatus(200);
});

router.get("/validate/control-access", controlAccess, (req, res) => {
    res.sendStatus(200);
});

router.use("/admin", [controlAccess, auth, hasAdmin],  adminRouter);
router.use("/tickets", [controlAccess, auth],  ticketsRouter);
router.use("/scores", [controlAccess, auth],  scoresRouter);
router.use("/bases", [controlAccess, auth],  basesRouter);
router.use("/teams", [controlAccess, auth],  teamsRouter);
router.use("/users", [controlAccess],  usersRouter);

export default router;