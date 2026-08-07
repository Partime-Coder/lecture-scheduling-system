import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({

     title: {
        type: String,
        required: true,
        trim: true,
    },
    
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true,
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    lectureDate: {
        type: Date,
        required: true,
    },

}, { timestamps: true });

export const Lecture = mongoose.model("Lecture", lectureSchema);