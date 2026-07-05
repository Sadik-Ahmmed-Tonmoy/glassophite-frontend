import { baseApi } from "../../api/baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    getProductReviews: builder.query({
      query: ({ productId, page = 1, limit = 10, sortBy = "newest" }) => ({
        url: `reviews/product/${productId}`,
        params: { page, limit, sortBy },
      }),
      providesTags: (_result, _err, { productId }) => [{ type: "reviews", id: productId }],
    }),

    // Admin
    getAllReviews: builder.query({
      query: (params = {}) => ({ url: "reviews", params }),
      providesTags: ["reviews"],
    }),

    // User
    createReview: builder.mutation({
      query: ({ productId, ...body }) => ({
        url: `reviews/product/${productId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _err, { productId }) => [{ type: "reviews", id: productId }, "product"],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...body }) => ({ url: `reviews/${id}`, method: "PATCH", body }),
      invalidatesTags: ["reviews"],
    }),
    deleteReview: builder.mutation({
      query: (id: string) => ({ url: `reviews/${id}`, method: "DELETE" }),
      invalidatesTags: ["reviews"],
    }),
    markHelpful: builder.mutation({
      query: ({ id, type }: { id: string; type: "helpful" | "unhelpful" }) => ({
        url: `reviews/${id}/${type}`,
        method: "POST",
      }),
      invalidatesTags: ["reviews"],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useGetAllReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkHelpfulMutation,
} = reviewApi;
