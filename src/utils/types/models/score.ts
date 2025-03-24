import { Types } from "mongoose";

export interface ScoreModelType {
    _id: Types.ObjectId;
    baseLeader: {
        id: Types.ObjectId;
        name: string;
    };
    score: number;
    extraScore: number;
    extraScoreReason?: string;
    teamLeader: {
        id: Types.ObjectId;
        name: string;
    };
    base: {
        id: Types.ObjectId;
        name: string;
    };
    team: {
        id: Types.ObjectId;
        name: string;
    };
    branch: "wolfcub" | "scout" | "senior" | "pioneer" | "all";
    local: string;
    createAt: Date;
    lastUpdate?: Date;
    observations?: string;
    inputIn?: Date;
    outputIn?: Date;
    images?: {
        profile?: string;
    };
    teamLeaderConfirm: boolean;
    type: "fixed" | "mobile" | "secret" | "special";
}
