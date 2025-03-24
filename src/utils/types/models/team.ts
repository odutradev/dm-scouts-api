import { Types } from "mongoose";

export interface teamModelType {
    name: string;
    group: number;
    leader: {
        id: Types.ObjectId;
        name: string;
    };
    status: "active" | "inactive";
    branch: "wolfcub" | "scout" | "senior" | "pioneer";
    local: string;
    createAt: Date;
    lastUpdate?: Date;
    description?: string;
    images?: {
        profile?: string;
    };
}
