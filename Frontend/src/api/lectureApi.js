import { baseApi } from "./baseApi";

export const lectureApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createLecture: builder.mutation({
            query: (data) => ({
                url: "/lectures",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Lecture"],
        }),

        getAllLectures: builder.query({
            query: () => ({
                url: "/lectures",
                method: "GET",
            }),
            providesTags: ["Lecture"],
        }),

        getMyLectures: builder.query({
            query: () => ({
                url: "/lectures/my-lectures",
                method: "GET",
            }),
            providesTags: ["Lecture"],
        }),
    }),
});

export const {
    useCreateLectureMutation,
    useGetAllLecturesQuery,
    useGetMyLecturesQuery,
} = lectureApi;