"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser, useCurrentToken } from "@/redux/features/auth/authSlice";
import { baseApi } from "@/redux/api/baseApi";

export default function NextAuthSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const currentToken = useAppSelector(useCurrentToken);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.accessToken) {
      if (currentToken !== session.accessToken) {
        // If user explicitly logged out (currentToken is null after initial mount), do not restore old session
        if (currentToken === null && !isInitialMount.current) {
          signOut({ redirect: false });
          return;
        }

        dispatch(baseApi.util.resetApiState());
        dispatch(
          setUser({
            user: {
              email: session.user?.email,
              name: session.user?.name,
              image: session.user?.image,
              role: session.user?.role || "USER",
              id: session.user?.id,
            },
            access_token: session.accessToken,
            refresh_token: session.refreshToken || null,
          })
        );
      }
    }

    isInitialMount.current = false;
  }, [session, currentToken, status, dispatch]);

  return null;
}
