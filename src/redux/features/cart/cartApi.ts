import { baseApi } from "../../api/baseApi";

const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({ url: "cart" }),
      providesTags: ["cart"],
    }),
    addToCart: builder.mutation({
      query: (body: { productId: string; variantId?: string; quantity: number; color?: string; colorName?: string }) => ({
        url: "cart/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }: { itemId: string; quantity: number }) => ({
        url: `cart/${itemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["cart"],
    }),
    removeFromCart: builder.mutation({
      query: (itemId: string) => ({
        url: `cart/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "cart",
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
