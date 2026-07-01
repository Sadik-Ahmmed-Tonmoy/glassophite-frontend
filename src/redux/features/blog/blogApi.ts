import { baseApi } from "../../api/baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPosts: builder.query({
      query: (filters = {}) => ({ url: "blogs", params: filters }),
      providesTags: ["blogs"],
    }),
    getFeaturedPosts: builder.query({
      query: (limit = 4) => ({ url: "blogs/featured", params: { limit } }),
      providesTags: ["blogs"],
    }),
    getPostBySlug: builder.query({
      query: (slug: string) => ({ url: `blogs/${slug}` }),
      providesTags: (_result, _err, slug) => [{ type: "blog", id: slug }],
    }),
    createPost: builder.mutation({
      query: (body) => ({ url: "blogs", method: "POST", body }),
      invalidatesTags: ["blogs"],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...body }) => ({ url: `blogs/${id}`, method: "PATCH", body }),
      invalidatesTags: ["blogs"],
    }),
    deletePost: builder.mutation({
      query: (id: string) => ({ url: `blogs/${id}`, method: "DELETE" }),
      invalidatesTags: ["blogs"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetFeaturedPostsQuery,
  useGetPostBySlugQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = blogApi;
