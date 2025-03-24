import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
    baseLeader: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        name: String
    },
    score: {
        type: Number,
        default: 0
    },
    extraScore: {
        type: Number,
        default: 0
    },
    extraScoreReason: {
        type: String
    },
    teamLeader: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        name: String
    },
    base: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "base"
        },
        name: String
    },
    team: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "team"
        },
        name: String
    },
    branch: {
        enum: ["wolfcub", "scout", "senior", "pioneer", "all"],
        type: String,
    },
    local: String,
    createAt: {
        default: Date.now(),
        type: Date,
    },
    lastUpdate: {
        type: Date,
    },
    observations: {
        type: String
    },
    inputIn: Date,
    outputIn: Date,
    images: {
        profile: String
    },
    teamLeaderConfirm: {
        type: Boolean,
        default: false
    },
    type: {
        enum: ["fixed", "mobile", "secret", "special"],
        type: String,
        default: "fixed"
    }
});

const scoreModel = mongoose.model("score", scoreSchema);

export default scoreModel;
