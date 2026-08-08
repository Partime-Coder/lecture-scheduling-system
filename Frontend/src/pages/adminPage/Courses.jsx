import { useState } from "react";
import { useGetAllCoursesQuery } from "../../api/courseApi.js";
import { Loader, CourseCard, CourseForm } from "../../components/index.js";

function Courses() {
    const [showForm, setShowForm] = useState(false);

    const { data, isLoading, isError } = useGetAllCoursesQuery();

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-red-500">Failed to load courses.</p>
            </div>
        );
    }

    const courses = data?.data || [];

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Courses
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your courses
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
                >
                    + Create Course
                </button>
            </div>

            {courses.length === 0 ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                    <p className="text-gray-500">No courses found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {courses.map((course) => (
                        <CourseCard
                            key={course._id}
                            course={course}
                        />
                    ))}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-5 sm:p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Create Course
                            </h2>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="text-xl text-gray-400 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        <CourseForm />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Courses;