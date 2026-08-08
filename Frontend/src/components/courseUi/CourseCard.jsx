import React from "react";
import { useNavigate } from "react-router-dom";

function CourseCard({ course }) {
    const navigate = useNavigate();

    const levelColor = {
        Beginner: "bg-green-900 text-green-400",
        Intermediate: "bg-orange-900 text-orange-400",
        Advanced: "bg-red-900 text-red-400",
    };

    return (
        <div
            onClick={() => navigate(`/admin/courses/${course._id}`)}
            className="w-full cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-[#292929] transition hover:-translate-y-1 hover:border-blue-500"
        >
            <div
                className="h-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${course.image})` }}
            />

            <div className="p-4">
                <h2 className="truncate text-sm font-semibold text-white">
                    {course.name}
                </h2>

                {course.level && (
                    <span
                        className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${
                            levelColor[course.level] ||
                            "bg-gray-800 text-gray-400"
                        }`}
                    >
                        {course.level}
                    </span>
                )}
            </div>
        </div>
    );
}

export default CourseCard;

