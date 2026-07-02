import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),
    loginWithGoogle: builder.mutation({
      query: (userInfo) => ({
        url: "auth/google-login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),
    forgotPassword: builder.mutation({
      query: (userInfo) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation({
      query: (userInfo) => ({
        url: "auth/reset-password",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: (userInfo) => ({
        url: "users/update-user",
        method: "PATCH",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "auth/register",
        method: "POST",
        body: userInfo,
      }),
    }),
    registerStaff: builder.mutation({
      query: (userInfo) => ({
        url: "auth/register-staff",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["users"],
    }),
    otp: builder.mutation({
      query: (userInfo) => ({
        url: "auth/verify-otp",
        method: "POST",
        body: userInfo,
      }),
    }),
    resendOtp: builder.mutation({
      query: (userInfo) => ({
        url: "auth/resend-otp",
        method: "POST",
        body: userInfo,
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: "auth/get-me",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRegisterMutation,
  useRegisterStaffMutation,
  useUpdateUserMutation,
  useOtpMutation,
  useResendOtpMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
