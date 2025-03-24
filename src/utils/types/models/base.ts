import { Types } from "mongoose";

export interface baseModelType {
    name: string;
    number: number;
    branch: "wolfcub" | "scout" | "senior" | "pioneer" | "all";
    leader: {
        id: Types.ObjectId;
        name: string;
    };
    local: string; 
    status: "active" | "inactive";
    createAt: Date;
    lastUpdate?: Date;
    description?: string;
    images?: {
        profile?: string;
    };
    type: "fixed" | "mobile" | "secret" | "special"; 
}
