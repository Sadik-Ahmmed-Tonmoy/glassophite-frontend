import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const access_token = (getState() as RootState).auth.access_token;
    headers.set("accept", "application/json");
    if (access_token) {
      headers.set("authorization", `Bearer ${access_token}`);
    }
    return headers;
  },
});

// A simple mutex to prevent concurrent token refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string | null) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshToken = (api.getState() as RootState).auth.refresh_token;

        if (!refreshToken) {
          isRefreshing = false;
          api.dispatch(logout());
          return result;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to refresh token");
        }

        const data = await res.json();
        if (data?.success) {
          const user = (api.getState() as RootState).auth.user;
          api.dispatch(
            setUser({
              user,
              access_token: data.data.accessToken,
              refresh_token: data.data.refreshToken || refreshToken,
            })
          );
          
          isRefreshing = false;
          onRefreshed(data.data.accessToken);
          
          // Retry the original query
          result = await baseQuery(args, api, extraOptions);
        } else {
          isRefreshing = false;
          onRefreshed(null);
          api.dispatch(logout());
        }
      } catch {
        isRefreshing = false;
        onRefreshed(null);
        api.dispatch(logout());
      }
    } else {
      // Wait for the active refresh request to complete
      const newToken = await new Promise<string | null>((resolve) => {
        subscribeTokenRefresh((token) => {
          resolve(token);
        });
      });

      if (newToken) {
        // Retry the query with the new token
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "user", "users", "example",
    "products", "product",
    "brands", "brand",
    "blogs", "blog",
    "coupons", "coupon",
    "wishlist",
    "reviews", "review",
    "orders", "order",
    "cart",
    "navbar", "navbars",
    "stockRequest",
    "addresses",
    "faqs", "faq",
    "lenses", "lens",
    "notifications",
    "supportTickets",
    "supportTicket",
  ],
  endpoints: () => ({}),
});
