import { useGetAllLecturesQuery } from "../../api/lectureApi.js";
import { Loader } from "../../components/index.js";

function Lectures() {
    const { data, isLoading, isError } = useGetAllLecturesQuery();

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
                <p className="text-red-500">
                    Failed to load lectures.
                </p>
            </div>
        );
    }

    const lectures = data?.data || [];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Lectures
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage all lectures
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-sm font-medium text-gray-600">
                                Lecture
                            </th>

                            <th className="px-6 py-4 text-sm font-medium text-gray-600">
                                Course
                            </th>

                            <th className="px-6 py-4 text-sm font-medium text-gray-600">
                                Instructor
                            </th>

                            <th className="px-6 py-4 text-sm font-medium text-gray-600">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {lectures.map((lecture) => {
                            const instructor = lecture.instructor;

                            const instructorName =
                                `${instructor?.firstName || ""} ${instructor?.lastName || ""}`.trim();

                            const initials =
                                `${instructor?.firstName?.[0] || ""}${instructor?.lastName?.[0] || ""}`;

                            const formattedDate = lecture.lectureDate
                                ? new Date(
                                      lecture.lectureDate
                                  ).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                  })
                                : "—";

                            return (
                                <tr
                                    key={lecture._id}
                                    className="hover:bg-gray-50"
                                >
                                    {/* Lecture */}
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">
                                            {lecture.title}
                                        </span>
                                    </td>

                                    {/* Course */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {lecture.course?.name || "—"}
                                    </td>

                                    {/* Instructor */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                                                {initials || "I"}
                                            </div>

                                            <span className="font-medium text-gray-900">
                                                {instructorName ||
                                                    instructor?.email ||
                                                    "—"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {formattedDate}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {lectures.length === 0 && (
                    <div className="flex min-h-40 items-center justify-center">
                        <p className="text-sm text-gray-500">
                            No lectures found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Lectures;

