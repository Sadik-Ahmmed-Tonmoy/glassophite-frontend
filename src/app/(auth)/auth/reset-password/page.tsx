import { BackgroundBeams } from "@/components/ui/background-beams";
import { ResetPassword } from "@/components/pages/auth/ResetPassword";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Glassophite account.",
};

const ResetPasswordPage = () => {
  return (
    <div className="h-full w-full">
      <HeroHighlight>
        <ResetPassword />
        <BackgroundBeams />
      </HeroHighlight>
    </div>
  );
};

export default ResetPasswordPage;
