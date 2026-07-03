import { baseApi } from "../../api/baseApi";

const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => ({ url: "wishlist" }),
      providesTags: ["wishlist"],
    }),
    addToWishlist: builder.mutation({
      query: (productId: string) => ({
        url: `wishlist/${productId}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["wishlist"],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId: string) => ({
        url: `wishlist/${productId}`,
        method: "DELETE",
        body: {},
      }),
      invalidatesTags: ["wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
