/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export interface IBanner {
  id: string;
  _id?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  buttonText?: string;
  discountTag?: string;
  status: "ACTIVE" | "INACTIVE";
  order: number;
  expiryDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveBanners: builder.query<IBanner[], void>({
      query: () => ({
        url: "banners/active",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        return [];
      },
      providesTags: ["banners"],
    }),

    getAllBanners: builder.query<
      { data: IBanner[]; meta?: { page: number; limit: number; total: number } },
      { search?: string; status?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "banners",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response?.data)) {
          return { data: response.data, meta: response.meta };
        }
        if (Array.isArray(response)) {
          return { data: response };
        }
        return { data: [], meta: { page: 1, limit: 20, total: 0 } };
      },
      providesTags: ["banners"],
    }),

    getBannerById: builder.query<IBanner, string>({
      query: (id) => ({
        url: `banners/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["banner"],
    }),

    createBanner: builder.mutation<IBanner, Partial<IBanner>>({
      query: (body) => ({
        url: "banners",
        method: "POST",
        body,
      }),
      invalidatesTags: ["banners"],
    }),

    updateBanner: builder.mutation<IBanner, { id: string; body: Partial<IBanner> }>({
      query: ({ id, body }) => ({
        url: `banners/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["banners", "banner"],
    }),

    deleteBanner: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banners"],
    }),
  }),
});

export const {
  useGetActiveBannersQuery,
  useGetAllBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
