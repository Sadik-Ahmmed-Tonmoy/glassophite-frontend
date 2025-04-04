import { HeroHighlight } from '@/components/ui/hero-highlight';
import { RegisterWithEmail } from '../../../../components/pages/auth/RegisterWithEmail';
import { BackgroundBeams } from '@/components/ui/background-beams';

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