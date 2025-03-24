import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    updatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    allowTeamRegistration: {
        type: Boolean,
        default: true
    },
    allowBaseRegistration: {
        type: Boolean,
        default: true
    },
    allowScoreApplication: {
        type: Boolean,
        default: true
    },
    mode: {
        type: String,
        enum: ["GJE", "JDC"],
        default: "GJE"
    }
});

const configModel = mongoose.model("config", configSchema);

export default configModel;
