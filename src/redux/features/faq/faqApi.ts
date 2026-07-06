import { baseApi } from "../../api/baseApi";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFAQs: builder.query({
      query: (params = {}) => ({
        url: "faqs",
        params,
      }),
      providesTags: ["faqs"],
    }),
    createFAQ: builder.mutation({
      query: (body) => ({
        url: "faqs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["faqs"],
    }),
    updateFAQ: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `faqs/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["faqs"],
    }),
    deleteFAQ: builder.mutation({
      query: (id) => ({
        url: `faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["faqs"],
    }),
  }),
});

export const {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = faqApi;
