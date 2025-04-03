import LoginWithGoogle from '@/components/LoginWithGoogle';
import Banner from '@/components/pages/home/Banner/Banner';
import React from 'react';

const page = () => {
    return (
        <div>
        <Banner/>
            <LoginWithGoogle/> 
        </div>
    );
};

export default page;