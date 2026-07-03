import { baseApi } from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({ url: "auth/get-me" }),
      providesTags: ["user"],
    }),
    updateMe: builder.mutation({
      query: (body) => ({ url: "users/update-user", method: "PATCH", body }),
      invalidatesTags: ["user"],
    }),
    getAllUsers: builder.query({
      query: (params = {}) => ({ url: "users/all", params }),
      providesTags: ["users"],
    }),
    getUserById: builder.query({
      query: (id: string) => ({ url: `users/single/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "user", id }],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `users/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["users"],
    }),
    deleteAccount: builder.mutation({
      query: () => ({ url: "users/delete-user", method: "DELETE" }),
      invalidatesTags: ["user"],
    }),
    changePassword: builder.mutation({
      query: (body) => ({ url: "auth/change-password", method: "PUT", body }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useDeleteAccountMutation,
  useChangePasswordMutation,
} = userApi;
