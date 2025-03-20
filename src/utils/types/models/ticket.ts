import { Types } from "mongoose";

export interface TicketMessageType  {
    userID: Types.ObjectId;
    username: string;
    content: string;
    date: Date;
};

export interface TicketModelType {
    status: "pending" | "answered" | "progress" | "completed"; 
    type: "suggestion" | "report" | "feedback" | "other";
    messages: TicketMessageType[];
    scope: "system";
    userID?: Types.ObjectId;
    attachments: string[];
    description?: string;
    displayName: boolean;
    lastUpdate?: Date;
    createAt?: Date;
    title: string;
    _id: string;
};