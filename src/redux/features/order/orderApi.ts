import { baseApi } from "../../api/baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin
    getAllOrders: builder.query({
      query: (params = {}) => ({ url: "orders", params }),
      providesTags: ["orders"],
    }),

    // User
    getMyOrders: builder.query({
      query: (params = {}) => ({ url: "orders/my-orders", params }),
      providesTags: ["orders"],
    }),
    getOrderById: builder.query({
      query: (id: string) => ({ url: `orders/${id}` }),
      providesTags: (_result, _err, id) => [{ type: "order", id }],
    }),

    // Place order (COD / non-Stripe)
    createOrder: builder.mutation({
      query: (body) => ({ url: "orders", method: "POST", body }),
      invalidatesTags: ["orders"],
    }),

    // Admin: update order status
    updateOrderStatus: builder.mutation({
      query: ({ id, ...body }) => ({ url: `orders/${id}/status`, method: "PATCH", body }),
      invalidatesTags: ["orders"],
    }),
    deleteOrder: builder.mutation({
      query: (id: string) => ({ url: `orders/${id}`, method: "DELETE" }),
      invalidatesTags: ["orders"],
    }),

    // Payment: create SSL Commerz session or place COD order
    createSslSession: builder.mutation({
      query: (body) => ({ url: "payment/create-session", method: "POST", body }),
    }),
    verifySslPayment: builder.query({
      query: (tranId: string) => ({ url: `payment/verify/${tranId}` }),
    }),

    // Delivery settings (public)
    getDeliverySettings: builder.query<{
      data: {
        standardDays: number;
        expressDays: number;
        standardCost: number;
        expressCost: number;
        rewardPointRate: number;
        rewardEarnRate: number;
      }
    }, void>({
      query: () => ({ url: "orders/delivery-settings" }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useCreateSslSessionMutation,
  useVerifySslPaymentQuery,
  useGetDeliverySettingsQuery,
} = orderApi;
