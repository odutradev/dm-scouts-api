import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    name: String,
    space: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "space"
        },
        name: String
    }, 
    status: {
        enum: ["active", "inactive"],
        default: "active",
        type: String,
    },
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
    metrics:{
        users: {
            type: Number,
            default: 0,
        }
    },
});

const classModel = mongoose.model("class", classSchema);

export default classModel;