import { Router } from "express";

import usersResource from "@resources/users/users.resource";
import manageRequest from "@middlewares/manageRequest";
import auth from "@middlewares/auth";

const usersRouter = Router();

usersRouter.get("/auth/me", [auth],  manageRequest(usersResource.getUser));
usersRouter.post("/auth/signup", manageRequest(usersResource.signUp));
usersRouter.post("/auth/signin", manageRequest(usersResource.signIn));

usersRouter.patch("/profile/update", [auth], manageRequest(usersResource.updateProfile));

export default usersRouter;