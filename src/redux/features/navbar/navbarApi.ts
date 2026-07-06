import { baseApi } from "../../api/baseApi";

const navbarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNavbarMenus: builder.query({
      query: (params = {}) => ({ url: "navbar-menus", params }),
      providesTags: ["navbars"],
    }),
    createNavbarMenu: builder.mutation({
      query: (body) => ({
        url: "navbar-menus",
        method: "POST",
        body,
      }),
      invalidatesTags: ["navbars"],
    }),
    updateNavbarMenu: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `navbar-menus/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["navbars"],
    }),
    deleteNavbarMenu: builder.mutation({
      query: (id: string) => ({
        url: `navbar-menus/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["navbars"],
    }),
    reorderNavbarMenus: builder.mutation({
      queryFn: async (items, _queryApi, _extraOptions, baseQuery) => {
        const results = await Promise.all(
          (items as { id: string; order: number }[]).map(({ id, order }) =>
            baseQuery({
              url: `navbar-menus/${id}`,
              method: "PATCH",
              body: { order },
            })
          )
        );
        const errors = results.filter((r) => r.error);
        if (errors.length > 0) {
          return { error: errors[0].error as { status: number; data: unknown } };
        }
        return { data: results.map((r) => r.data) };
      },
      invalidatesTags: ["navbars"],
    }),
  }),
});

export const {
  useGetAllNavbarMenusQuery,
  useCreateNavbarMenuMutation,
  useUpdateNavbarMenuMutation,
  useDeleteNavbarMenuMutation,
  useReorderNavbarMenusMutation,
} = navbarApi;
