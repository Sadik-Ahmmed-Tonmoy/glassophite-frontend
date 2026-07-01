import { baseApi } from "../../api/baseApi";

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query({
      query: (filters = {}) => ({ url: "brands", params: filters }),
      providesTags: ["brands"],
    }),
    getBrandBySlug: builder.query({
      query: (slug: string) => ({ url: `brands/${slug}` }),
      providesTags: (_result, _err, slug) => [{ type: "brand", id: slug }],
    }),
    createBrand: builder.mutation({
      query: (body) => ({ url: "brands", method: "POST", body }),
      invalidatesTags: ["brands"],
    }),
    updateBrand: builder.mutation({
      query: ({ id, ...body }) => ({ url: `brands/${id}`, method: "PATCH", body }),
      invalidatesTags: ["brands"],
    }),
    deleteBrand: builder.mutation({
      query: (id: string) => ({ url: `brands/${id}`, method: "DELETE" }),
      invalidatesTags: ["brands"],
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useGetBrandBySlugQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
