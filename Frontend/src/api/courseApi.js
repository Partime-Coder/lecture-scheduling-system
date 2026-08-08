import { baseApi } from "./baseApi";

export const courseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (data) => ({
                url: "/courses",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Course"],
        }),

        getAllCourses: builder.query({
            query: () => ({
                url: "/courses",
                method: "GET",
            }),
            providesTags: ["Course"],
        }),

        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/courses/${courseId}`,
                method: "GET",
            }),
            providesTags: ["Course"],
        }),

        updateCourse: builder.mutation({
            query: ({ courseId, data }) => ({
                url: `/courses/${courseId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Course"],
        }),

        updateCourseImage: builder.mutation({
            query: ({ courseId, data }) => ({
                url: `/courses/${courseId}/image`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Course"],
        }),

        deleteCourse: builder.mutation({
            query: (courseId) => ({
                url: `/courses/${courseId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Course"],
        }),
    }),
});

export const {
    useCreateCourseMutation,
    useGetAllCoursesQuery,
    useGetCourseByIdQuery,
    useUpdateCourseMutation,
    useUpdateCourseImageMutation,
    useDeleteCourseMutation,
} = courseApi;