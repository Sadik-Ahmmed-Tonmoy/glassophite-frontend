import { BackgroundBeams } from "@/components/ui/background-beams";
import { LoginWithEmail } from "../../../../components/pages/auth/LoginWithEmail";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Glassophite account to manage your orders, check your wishlist, and access premium member benefits.",
};

const LoginPage = () => {
  return (
    <div className="h-full w-full">
      <HeroHighlight>
        <Suspense fallback={<div className="text-white">Loading login form...</div>}>
          <LoginWithEmail />
        </Suspense>
        <BackgroundBeams />
      </HeroHighlight>
    </div>
  );
};

export default LoginPage;
