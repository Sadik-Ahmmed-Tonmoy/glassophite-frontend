import { BackgroundBeams } from "@/components/ui/background-beams";
import { VerifyOtp } from "@/components/pages/auth/VerifyOtp";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Enter the 6-digit verification code sent to your email to complete your Glassophite account setup.",
};

const VerifyOtpPage = () => {
  return (
    <div className="h-full w-full">
      <HeroHighlight>
        <VerifyOtp />
        <BackgroundBeams />
      </HeroHighlight>
    </div>
  );
};

export default VerifyOtpPage;
