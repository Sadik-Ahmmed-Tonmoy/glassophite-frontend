import { baseApi } from "../../api/baseApi";

const rewardsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyRewards: builder.query<{
      data: {
        rewardPoints: number;
        rewardValue: number;
        pointRate: number;
      }
    }, void>({
      query: () => ({ url: "users/my-rewards" }),
      providesTags: ["user"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMyRewardsQuery } = rewardsApi;
