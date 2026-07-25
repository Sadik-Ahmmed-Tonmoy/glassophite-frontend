import { NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers/index";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";

const googleClientId = (process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_Google_ID) as string;
const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || process.env.NEXT_PUBLIC_GOOGLE_SECRET) as string;
const nextAuthSecret = process.env.NEXTAUTH_SECRET || process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://glassophite-backend.vercel.app/api/v1";

const providers: Provider[] = [
  GoogleProvider({
    clientId: googleClientId,
    clientSecret: googleClientSecret,
  }),
];

if (process.env.NEXT_PUBLIC_FACEBOOK_ID && process.env.NEXT_PUBLIC_FACEBOOK_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_SECRET as string,
    })
  );
}

if (process.env.NEXT_PUBLIC_APPLE_ID && process.env.NEXT_PUBLIC_APPLE_SECRET) {
  providers.push(
    AppleProvider({
      clientId: process.env.NEXT_PUBLIC_APPLE_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_APPLE_SECRET as string,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        try {
          const res = await fetch(`${baseUrl}/auth/google-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });

          const data = await res.json();
          if (data?.success && data?.data) {
            user.accessToken = data.data.accessToken;
            user.refreshToken = data.data.refreshToken;
            user.role = data.data.user?.role || data.data.role || "USER";
            user.id = data.data.user?.id;
          }
        } catch (error) {
          console.error("Error during backend google-login sync:", error);
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },

  secret: nextAuthSecret,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
};
