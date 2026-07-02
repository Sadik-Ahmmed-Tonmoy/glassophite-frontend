import { BackgroundBeams } from "@/components/ui/background-beams";
import { ForgotPassword } from "@/components/pages/auth/ForgotPassword";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Glassophite account password. We'll send you a verification code to your email.",
};

const ForgotPasswordPage = () => {
  return (
    <div className="h-full w-full">
      <HeroHighlight>
        <ForgotPassword />
        <BackgroundBeams />
      </HeroHighlight>
    </div>
  );
};

export default ForgotPasswordPage;
