import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },

    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    image: {
        type: String,
        required: true,
    },

    imagePublicId: {
        type: String,
        required: true,
    },

}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);