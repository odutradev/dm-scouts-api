import mongoose from "mongoose";

const baseSchema = new mongoose.Schema({
    name: String,
    number: Number,
    leader: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        name: String
    },
    status: {
        enum: ["active", "inactive"],
        default: "active",
        type: String,
    },
    branch: {
        enum: ["wolfcub", "scout", "senior", "pioneer", "all"],
        default: "all",
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
    description: {
        type: String
    },
    images: {
        profile: String
    },
    type: {
        enum: ["fixed", "mobile", "secret", "special"],
        type: String,
        default: "fixed"
    }
});

const baseModel = mongoose.model("base", baseSchema);

export default baseModel;
