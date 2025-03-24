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
        type: String,
    },
    location: String,
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

const classModel = mongoose.model("base", baseSchema);

export default classModel;
