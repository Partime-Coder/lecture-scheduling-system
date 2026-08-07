import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import { Lecture } from '../models/lectures.model.js';

const createLecture = asyncHandler(async (req, res) => {
     const {
        title,
        course,
        instructor,
        lectureDate,
    } = req.body;

    if (!title || title.trim() === "") {
        throw new apiError(400, "Lecture title is required");
    };

    if (!course) {
        throw new apiError(400, "Course is required");
    };

    if (!instructor) {
        throw new apiError(400, "Instructor is required");
    };

    if (!lectureDate) {
        throw new apiError(400, "Lecture date is required");
    };

    const instructorExists = await User.findOne({
        _id: instructor,
        role: "instructor",
    });

    if (!instructorExists) {
        throw new apiError(404, "Instructor not found");
    }

    const courseExists = await Course.findById(course);

    if (!courseExists) {
        throw new apiError(404, "Course not found");
    };

    const existingLecture = await Lecture.findOne({
        instructor,
        lectureDate,
    });

    if (existingLecture) {
        throw new apiError(
            409,
            "Instructor already has a lecture on this date"
        );
    }

    const lecture = await Lecture.create({
        title,
        course,
        instructor,
        lectureDate,
    });

    return res.status(201).json(
        new apiResponse(
            201,
            lecture,
            "Lecture created successfully"
        )
    );

});

const getAllLectures = asyncHandler(async (req, res) => {
    const lectures = await Lecture.find().populate('course').populate('instructor');
    return res.status(200).json(new apiResponse(200, lectures, "All lectures fetched successfully"));
});

const getMyLectures = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const lectures = await Lecture.find({ instructor: userId }).populate('course');
    return res.status(200).json(new apiResponse(200, lectures, "My lectures fetched successfully"));
});

export {
    createLecture,
    getAllLectures,
    getMyLectures,
};


// createLecture
// getAllLectures
// getMyLectures
// updateLecture
// deleteLecture