import { baseApi } from "../../api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    getFilterOptions: builder.query({
      query: () => ({ url: "products/filter-options" }),
      providesTags: ["products"],
    }),
    getAllProducts: builder.query({
      query: (filters = {}) => ({
        url: "products",
        method: "GET",
        params: filters,
      }),
      providesTags: ["products"],
    }),
    getFeaturedProducts: builder.query({
      query: (limit = 8) => ({ url: `products/featured`, params: { limit } }),
      providesTags: ["products"],
    }),
    getBestSellers: builder.query({
      query: (limit = 8) => ({ url: `products/best-sellers`, params: { limit } }),
      providesTags: ["products"],
    }),
    getNewArrivals: builder.query({
      query: (limit = 8) => ({ url: `products/new-arrivals`, params: { limit } }),
      providesTags: ["products"],
    }),
    getProductById: builder.query({
      query: (id: string) => ({ url: `products/${id}` }),
      providesTags: (_result, _err, id) => [{ type: "product", id }],
    }),

    // Admin CRUD
    createProduct: builder.mutation({
      query: (body) => ({ url: "products", method: "POST", body }),
      invalidatesTags: ["products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `products/${id}`, method: "PATCH", body }),
      invalidatesTags: ["products"],
    }),
    deleteProduct: builder.mutation({
      query: (id: string) => ({ url: `products/${id}`, method: "DELETE" }),
      invalidatesTags: ["products"],
    }),

    // Variants
    addVariant: builder.mutation({
      query: ({ productId, ...body }) => ({ url: `products/${productId}/variants`, method: "POST", body }),
      invalidatesTags: ["products"],
    }),
    updateVariant: builder.mutation({
      query: ({ productId, variantId, ...body }) => ({
        url: `products/${productId}/variants/${variantId}`, method: "PATCH", body,
      }),
      invalidatesTags: ["products"],
    }),
    deleteVariant: builder.mutation({
      query: ({ productId, variantId }) => ({
        url: `products/${productId}/variants/${variantId}`, method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
    // Returns a DB-verified unique SKU code
    generateSKU: builder.query<{ data: { sku: string } }, string>({
      query: (category = "") => ({
        url: "products/generate-sku",
        params: { category },
      }),
    }),
  }),
});

export const {
  useGetFilterOptionsQuery,
  useGetAllProductsQuery,
  useGetFeaturedProductsQuery,
  useGetBestSellersQuery,
  useGetNewArrivalsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useLazyGenerateSKUQuery,
} = productApi;
