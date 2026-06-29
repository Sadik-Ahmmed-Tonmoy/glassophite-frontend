import { HeroHighlight } from '@/components/ui/hero-highlight';
import { RegisterWithEmail } from '../../../../components/pages/auth/RegisterWithEmail';
import { BackgroundBeams } from '@/components/ui/background-beams';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Glassophite account today to explore exclusive luxury eyewear collections, track your orders, and get early access to new releases.",
};

const RegisterPage = () => {
    return (
    
          <div className="h-full w-full">
              <HeroHighlight>
              <RegisterWithEmail/>
                <BackgroundBeams />
              </HeroHighlight>
            </div>
    );
};

export default RegisterPage;