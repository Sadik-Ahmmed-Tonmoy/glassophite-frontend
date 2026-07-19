/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<any, void>({
      query: () => ({ url: "dashboard/stats" }),
      providesTags: ["orders", "products", "users"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
