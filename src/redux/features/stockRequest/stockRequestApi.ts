import { baseApi } from "../../api/baseApi";

const stockRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStockRequest: builder.mutation({
      query: (body: { productId: string; variantId: string }) => ({
        url: "stock-requests",
        method: "POST",
        body,
      }),
      invalidatesTags: ["stockRequest"],
    }),
    getMyStockRequests: builder.query({
      query: () => ({
        url: "stock-requests/my-requests",
        method: "GET",
      }),
      providesTags: ["stockRequest"],
    }),
    getAllStockRequests: builder.query({
      query: () => ({
        url: "stock-requests",
        method: "GET",
      }),
      providesTags: ["stockRequest"],
    }),
    updateStockRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `stock-requests/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["stockRequest"],
    }),
  }),
});

export const {
  useCreateStockRequestMutation,
  useGetMyStockRequestsQuery,
  useGetAllStockRequestsQuery,
  useUpdateStockRequestStatusMutation,
} = stockRequestApi;
