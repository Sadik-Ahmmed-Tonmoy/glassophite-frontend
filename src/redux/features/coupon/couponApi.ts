import { baseApi } from "../../api/baseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin
    getAllCoupons: builder.query({
      query: () => ({ url: "coupons" }),
      providesTags: ["coupons"],
    }),
    createCoupon: builder.mutation({
      query: (body) => ({ url: "coupons", method: "POST", body }),
      invalidatesTags: ["coupons"],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...body }) => ({ url: `coupons/${id}`, method: "PATCH", body }),
      invalidatesTags: ["coupons"],
    }),
    deleteCoupon: builder.mutation({
      query: (id: string) => ({ url: `coupons/${id}`, method: "DELETE" }),
      invalidatesTags: ["coupons"],
    }),

    // User: validate a coupon code at checkout
    validateCoupon: builder.mutation({
      query: (body: { code: string }) => ({
        url: "coupons/validate",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
} = couponApi;
