import { Router } from "express";

import ticketsResource from "@resources/ticket/ticket.resource";
import manageRequest from "@middlewares/manageRequest";

const ticketsRouter = Router();

ticketsRouter.patch("/:ticketID/messages/add", manageRequest(ticketsResource.addTicketMessage));
ticketsRouter.patch("/:ticketID/update", manageRequest(ticketsResource.updateTicket));
ticketsRouter.get("/space/:spaceID", manageRequest(ticketsResource.getSpaceTickets));
ticketsRouter.get("/system", manageRequest(ticketsResource.getSystemTickets));
ticketsRouter.get("/:ticketID", manageRequest(ticketsResource.getTicket));
ticketsRouter.post("/create", manageRequest(ticketsResource.createTicket));
ticketsRouter.get("/user", manageRequest(ticketsResource.getUserTickets));

export default ticketsRouter;