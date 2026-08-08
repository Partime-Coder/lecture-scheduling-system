import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "/users/refresh-token",
        method: "POST",
        body: { refreshToken },
      }),
    }),

    getCurrentUser: builder.query({
      query: () => ({
        url: "/users/current-user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    getAllInstructors: builder.query({
      query: () => ({
        url: "/users/instructors",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useGetAllInstructorsQuery,
} = authApi;