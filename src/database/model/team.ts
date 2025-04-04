import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: String,
    group: Number,
    number: Number,
    leader: {
        id:{
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
        enum: ["wolfcub", "scout", "senior", "pioneer"],
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
    }
});

const teamModel = mongoose.model("team", teamSchema);

export default teamModel;