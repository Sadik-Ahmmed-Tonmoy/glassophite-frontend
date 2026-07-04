import { baseApi } from "../../api/baseApi";

const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: () => ({ url: "addresses" }),
      providesTags: ["addresses"],
    }),
    createAddress: builder.mutation({
      query: (body) => ({ url: "addresses", method: "POST", body }),
      invalidatesTags: ["addresses"],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...body }) => ({ url: `addresses/${id}`, method: "PATCH", body }),
      invalidatesTags: ["addresses"],
    }),
    deleteAddress: builder.mutation({
      query: (id: string) => ({ url: `addresses/${id}`, method: "DELETE" }),
      invalidatesTags: ["addresses"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
