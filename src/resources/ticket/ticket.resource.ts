import { TicketModelType } from "@utils/types/models/ticket";
import { ManageRequestBody } from "@middlewares/manageRequest";
//import { hasRolePermission } from "@database/functions/space";
import stringService from "@utils/services/stringServices";
import { hasUser } from "@database/functions/user";
import ticketModel from "@database/model/ticket";

const ticketResource = {
    createTicket: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            let { title, description, type, scope, attachments, displayName }: Partial<TicketModelType> = data;
            if (!title || !description || !type || !scope) return manageError({ code: "invalid_data" });

            description = stringService.filterBadwords(description);
            title = stringService.filterBadwords(title);

            const newTicket = new ticketModel({
                createAt: Date.now(),
                displayName,
                attachments,
                description,
                userID,
                scope,
                title,
                type,
            }); 

            return await newTicket.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getUserTickets: async ({ manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            return await ticketModel.find({ userID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getTicket: async ({ manageError, ids, params }: ManageRequestBody) => {
        try {
            const { ticketID } =  params;

            const { userID } = ids;
            if (!userID || !ticketID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const ticket = await ticketModel.findById(ticketID);
            if (!ticket) return manageError({ code: "ticket_not_found" });

            if (userID !== String(ticket.userID) && ticket.scope === "system"){   
                if (user.role !== "admin") return manageError({ code: "admin_access_denied" });
            };

            return ticket;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getSystemTickets: async ({ manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } = ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (user.role !== "admin") return manageError({ code: "admin_access_denied" });

            return await ticketModel.find({ scope: "system" });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    addTicketMessage: async ({ manageError, ids, params, data }: ManageRequestBody) => {
        try {
            const { ticketID } =  params;

            const { userID } = ids;
            if (!userID || !ticketID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const ticket = await ticketModel.findById(ticketID);
            if (!ticket) return manageError({ code: "ticket_not_found" });

            let { content } = data;

            content = stringService.filterBadwords(content || "");

            if (userID !== String(ticket.userID) && ticket.scope === "system"){   
                if (user.role !== "admin") return manageError({ code: "admin_access_denied" });
            };

            const messages = [
                ...ticket.messages,
                {
                    username: user.name,
                    date: Date.now(),
                    content,
                    userID
                }
            ];

            return await ticketModel.findByIdAndUpdate(ticketID, { $set:{ messages, lastUpdate: Date.now() } }, { new: true }); 
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateTicket: async ({ manageError, ids, params, data }: ManageRequestBody) => {
        try {
            const { ticketID } =  params;

            const { userID } = ids;
            if (!userID || !ticketID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const ticket = await ticketModel.findById(ticketID);
            if (!ticket) return manageError({ code: "ticket_not_found" });

            let { status } = data;

            if (userID !== String(ticket.userID) && ticket.scope === "system"){   
                if (user.role !== "admin") return manageError({ code: "admin_access_denied" });
            };

            return await ticketModel.findByIdAndUpdate(ticketID, { $set:{ status, lastUpdate: Date.now() } }, { new: true }); 
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    
};

export default ticketResource;