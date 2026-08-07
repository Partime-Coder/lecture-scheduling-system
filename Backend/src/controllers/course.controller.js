import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import { Course } from '../models/courses.model.js';
import { uploadFileOnCloudinary, updateFileOnCloudinary, deleteFileOnCloudinary } from '../services/cloudinary.service.js';

const createCourse = asyncHandler(async (req, res) => {
    const { name, level, description } = req.body;

    if (!name || name.trim() === "") {
        throw new apiError(400, "Course name is required");
    };

    if (!level || level.trim() === "") {
        throw new apiError(400, "Course level is required");
    };

    if (!description || description.trim() === "") {
        throw new apiError(400, "Course description is required");
    };

    if (!["Beginner", "Intermediate", "Advanced"].includes(level)) {
        throw new apiError(
            400,
            "Course level must be Beginner, Intermediate, or Advanced"
        );
    };
    const existedCourse = await Course.findOne({ name });

    if (existedCourse) {
        throw new apiError(409, "Course Already exist")
    };
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new apiError(400, "Course image is required");
    };
    const image = await uploadFileOnCloudinary(imageLocalPath);

    if (!image?.url) {
        throw new apiError(500, "Image upload failed");
    };

    const newCourse = await Course.create({
        name,
        level,
        description,
        image: image.url,
        imagePublicId: image.public_id,
    });
    if (!newCourse) {
        throw new apiError(500, "Failed to create course");
    };

    return res.status(201).json(
        new apiResponse(201, newCourse, "Course created successfully")
    );
});

const getAllCourses = asyncHandler(async (req, res) => {

    const courses = await Course.find();

    return res.status(200).json(
        new apiResponse(
            200,
            courses,
            "Courses fetched successfully"
        )
    );

});

const getCourseById = asyncHandler(async (req, res) => {

    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
        throw new apiError(404, "Course not found");
    };

    return res.status(200).json(
        new apiResponse(
            200,
            course,
            "Course fetched successfully"
        )
    );
});

const updateCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { name, level, description } = req.body;

    if (!name || name.trim() === "") {
        throw new apiError(400, "Course name is required");
    };
    if (!level || level.trim() === "") {
        throw new apiError(400, "Course level is required");
    };
    if (!description || description.trim() === "") {
        throw new apiError(400, "Course description is required");
    };
    if (!["Beginner", "Intermediate", "Advanced"].includes(level)) {
        throw new apiError(
            400,
            "Course level must be Beginner, Intermediate, or Advanced"
        );
    };

    const course = await Course.findByIdAndUpdate(
        courseId,
        {
            $set: {
                name,
                level,
                description,
            },
        },
        {
            new: true,
        }
    );

    if (!course) {
        throw new apiError(404, "Course not found");
    };

    return res.status(200).json(
        new apiResponse(
            200,
            course,
            "Course updated successfully"
        )
    );
});

const updateCourseImage = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new apiError(400, "Course image is required");
    };
    const image = await uploadFileOnCloudinary(imageLocalPath);

    if (!image?.url) {
        throw new apiError(500, "Image upload failed");
    };
    const course = await Course.findByIdAndUpdate(
        courseId,
        {
            $set: {
                image: image.url,
            },
        },
        {
            new: true,
        }
    );
    if (!course) {
        throw new apiError(404, "Course not found");
    };
    return res.status(200).json(
        new apiResponse(
            200,
            course,
            "Course image updated successfully"
        )
    );
});

const deleteCourse = asyncHandler(async (req, res) => {

    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
        throw new apiError(404, "Course not found");
    };
    await deleteFileOnCloudinary(course.imagePublicId);

    await course.deleteOne();

    return res.status(200).json(
        new apiResponse(
            200,
            {},
            "Course deleted successfully"
        )
    );
});

export { 
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    updateCourseImage,
    deleteCourse 
};

// createCourse
// getAllCourses
// getCourseById
// updateCourse
// updateCourseImage
// deleteCourse
