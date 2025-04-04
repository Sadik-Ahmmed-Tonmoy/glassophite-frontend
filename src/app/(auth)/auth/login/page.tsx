import { BackgroundBeams } from "@/components/ui/background-beams";
import { LoginWithEmail } from "../../../../components/pages/auth/LoginWithEmail";
import { HeroHighlight } from "@/components/ui/hero-highlight";

const LoginPage = () => {
  return (
    <div className="h-full w-full">
      <HeroHighlight>
        <LoginWithEmail />
        <BackgroundBeams />
      </HeroHighlight>
    </div>
  );
};

export default LoginPage;
