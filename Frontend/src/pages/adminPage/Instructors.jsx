import { useGetAllInstructorsQuery } from "../../api/userApi";
import { Loader } from "../../components/index.js";

function Instructors() {
    const { data, isLoading, isError } = useGetAllInstructorsQuery();

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
                <p className="text-red-500">Failed to load instructors.</p>
            </div>
        );
    }

    const instructors = data?.data || [];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Instructors
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage all instructors
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-sm font-medium text-gray-600">
                                Name
                            </th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-600">
                                Email
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {instructors.map((instructor) => {
                            const initials = `${instructor.firstName?.[0] || ""}${instructor.lastName?.[0] || ""}`;

                            return (
                                <tr
                                    key={instructor._id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                                                {initials}
                                            </div>

                                            <span className="font-medium text-gray-900">
                                                {instructor.firstName}{" "}
                                                {instructor.lastName}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {instructor.email}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Instructors;