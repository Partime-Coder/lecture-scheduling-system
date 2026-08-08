import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiEdit,
    FiImage,
    FiTrash2,
    FiPlus,
} from "react-icons/fi";

import {
    useGetCourseByIdQuery,
    useDeleteCourseMutation,
} from "../../api/courseApi.js";

import { LectureForm } from "../../components/index.js";

const LEVEL_STYLES = {
    Beginner:
        "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    Intermediate:
        "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    Advanced:
        "bg-rose-500/10 text-rose-400 ring-rose-500/20",
};

function CourseDetail() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [showLectureForm, setShowLectureForm] =
        useState(false);

    const {
        data,
        isLoading,
        isError,
    } = useGetCourseByIdQuery(courseId);

    const [
        deleteCourse,
        { isLoading: isDeleting },
    ] = useDeleteCourseMutation();

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-gray-400">
                    Loading course...
                </p>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <p className="text-red-400">
                    Failed to load course.
                </p>

                <button
                    onClick={() =>
                        navigate("/admin/courses")
                    }
                    className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                >
                    <FiArrowLeft />
                    Back to courses
                </button>
            </div>
        );
    }

    const course = data.data || data;

    const levelStyle =
        LEVEL_STYLES[course.level] ||
        "bg-gray-700/50 text-gray-300 ring-gray-600/40";

    const handleDelete = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this course?"
            )
        ) {
            return;
        }

        try {
            await deleteCourse(courseId).unwrap();

            navigate("/admin/courses");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-5 p-4 sm:p-6">
            <button
                onClick={() =>
                    navigate("/admin/courses")
                }
                className="group flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
            >
                <FiArrowLeft />
                Back to courses
            </button>

            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl shadow-black/20">
                <div className="relative h-52 w-full sm:h-72">
                    <img
                        src={course.image}
                        alt={course.name}
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <span
                            className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${levelStyle}`}
                        >
                            {course.level}
                        </span>

                        <h1 className="mt-2 text-xl font-bold text-white sm:text-3xl">
                            {course.name}
                        </h1>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
                        {course.description}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500">
                    <FiEdit />
                    Edit
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-3 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700">
                    <FiImage />
                    Image
                </button>

                {/* Create Lecture */}
                <button
                    onClick={() =>
                        setShowLectureForm(true)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                >
                    <FiPlus />
                    Lecture
                </button>

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-600/90 px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FiTrash2 />
                    {isDeleting
                        ? "Deleting…"
                        : "Delete"}
                </button>
            </div>

            {/* Create Lecture Modal */}
            {showLectureForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-5 sm:p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Create Lecture
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLectureForm(
                                        false
                                    )
                                }
                                className="text-xl text-gray-400 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        <LectureForm
                            courseId={courseId}
                            onSuccess={() =>
                                setShowLectureForm(
                                    false
                                )
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseDetail;