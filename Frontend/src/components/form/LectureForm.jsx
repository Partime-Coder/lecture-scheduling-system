import React from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Loader, Select } from "../index.js";

import {
    useCreateLectureMutation,
    useGetAllLecturesQuery,
} from "../../api/lectureApi.js";

import {
    useGetAllInstructorsQuery,
} from "../../api/userApi.js";

function LectureForm({ courseId, onSuccess }) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm();

    const [createLecture, { isLoading: isCreating }] =
        useCreateLectureMutation();

    const {
        data: instructorData,
        isLoading: isLoadingInstructors,
    } = useGetAllInstructorsQuery();

    const {
        data: lectureData,
        isLoading: isLoadingLectures,
    } = useGetAllLecturesQuery();

    const selectedInstructor = watch("instructor");

    const instructors = instructorData?.data || [];
    const lectures = lectureData?.data || [];

    // Lectures belonging to selected instructor
    const instructorLectures = lectures.filter(
        (lecture) =>
            lecture.instructor?._id === selectedInstructor ||
            lecture.instructor === selectedInstructor
    );

    // Get dates already used by selected instructor
    const bookedDates = instructorLectures.map((lecture) =>
        new Date(lecture.lectureDate)
            .toISOString()
            .split("T")[0]
    );

    const isDateBooked = (date) => {
        return bookedDates.includes(date);
    };

    const onSubmit = async (data) => {
        try {
            await createLecture({
                title: data.title,
                course: courseId,
                instructor: data.instructor,
                lectureDate: data.lectureDate,
            }).unwrap();

            reset();

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Create lecture error:", error);
        }
    };

    if (isLoadingInstructors || isLoadingLectures) {
        return (
            <div className="flex justify-center py-6">
                <Loader />
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            {/* Lecture Title */}
            <Input
                label="Lecture Title"
                placeholder="Enter lecture title"
                {...register("title", {
                    required: "Lecture title is required",
                })}
            />

            {errors.title && (
                <p className="text-xs text-red-500">
                    {errors.title.message}
                </p>
            )}

            {/* Course */}
            <div>
                <label className="mb-1 block text-sm text-gray-700">
                    Course
                </label>

                <input
                    type="text"
                    value="Current Course"
                    disabled
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                />
            </div>

            {/* Instructor */}
            <Select
                label="Instructor"
                options={instructors.map(
                    (instructor) => ({
                        label:
                            instructor.name ||
                            instructor.username ||
                            instructor.email,
                        value: instructor._id,
                    })
                )}
                {...register("instructor", {
                    required: "Instructor is required",
                })}
            />

            {errors.instructor && (
                <p className="text-xs text-red-500">
                    {errors.instructor.message}
                </p>
            )}

            {/* Lecture Date */}
            <div>
                <label className="mb-1 block text-sm text-gray-700">
                    Lecture Date
                </label>

                <input
                    type="date"
                    min={
                        new Date()
                            .toISOString()
                            .split("T")[0]
                    }
                    {...register("lectureDate", {
                        required:
                            "Lecture date is required",

                        validate: (value) =>
                            !isDateBooked(value) ||
                            "This instructor already has a lecture on this date.",
                    })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />

                {errors.lectureDate && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.lectureDate.message}
                    </p>
                )}
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={
                    isCreating ||
                    !selectedInstructor
                }
                className="w-full"
            >
                {isCreating ? (
                    <Loader size="sm" />
                ) : (
                    "Create Lecture"
                )}
            </Button>
        </form>
    );
}

export default LectureForm;