import { baseApi } from "../../api/baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({ url: "notifications" }),
      providesTags: ["notifications"],
    }),
    getUnreadNotificationCount: builder.query({
      query: () => ({ url: "notifications/unread-count" }),
      providesTags: ["notifications"],
    }),
    markNotificationRead: builder.mutation({
      query: (id: string) => ({ url: `notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["notifications"],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({ url: "notifications/read-all", method: "PATCH" }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
