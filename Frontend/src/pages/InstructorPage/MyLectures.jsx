import { useGetMyLecturesQuery } from "../../api/lectureApi.js";
import { Loader } from "../../components/index.js";

function MyLectures() {
    const { data, isLoading, isError } = useGetMyLecturesQuery();

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
                    Failed to load your lectures.
                </p>
            </div>
        );
    }

    const lectures = data?.data || [];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    My Lectures
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    View your scheduled lectures
                </p>
            </div>

            {/* Lectures Table */}
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
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {lectures.map((lecture) => {
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
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">
                                            {lecture.title}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {lecture.course?.name || "—"}
                                    </td>

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
                            No lectures scheduled.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyLectures;
