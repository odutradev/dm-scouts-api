import { Types } from "mongoose";

export interface ConfigModelType {
    _id: Types.ObjectId;
    lastUpdate: Date;
    status: "active" | "inactive";
    maintenanceMode: boolean;
    allowTeamRegistration: boolean;
    allowBaseRegistration: boolean;
    allowScoreApplication: boolean;
    mode: "GJE" | "JDC";
    initialScore: number;
}
