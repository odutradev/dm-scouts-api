import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: {
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
    status: {
        enum: ["pending", "answered", "progress", "completed"],
        default: "pending",
        type: String,
    },
    type: {
        type: String,
        enum: ["suggestion", "report", "feedback", "other"],
    },
    scope: {
        type: String,
        enum: ["space", "system"],     
    },
    displayName: {
        type: Boolean,
        default: false
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    spaceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "space"
    },
    messages: {
        type: [{
            content: String,
            username: String,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            date: {
                default: Date.now(),
                type: Date
            }
        }],
        default: []
    },
    attachments: {
        type: [String],
        default: []
    }
});

const ticketModel = mongoose.model("ticket", ticketSchema);

export default ticketModel;
