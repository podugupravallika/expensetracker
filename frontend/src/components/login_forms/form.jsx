import React, { useState } from 'react';
import Lottie from 'react-lottie';
import Register_anim from '../../assets/register.json';
import Login_anim from '../../assets/login.json';
import Login from '../login_forms/login';
import Register from '../login_forms/register';

const Form = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleToggle = () => {
        setIsLogin(!isLogin);
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: isLogin ? Login_anim : Register_anim,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    

    return (
        <>
            <section className="gradient-form w-full h-full bg-neutral-200 dark:bg-neutral-700">
                <div className="container mx-auto flex justify-center ">
                    <div className="flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
                        <div className="w-full h-full">
                            <div className="relative">
                                <div
                                    className={`w-full h-full lg:w-full px-2 md:px-6 lg:px-2 py-6 md:py-8 lg:py-4 ${isLogin ? 'animate-slide-left' : 'animate-slide-right'
                                        }`}
                                >
                                    {isLogin ? (
                                        <Login handleToggle={handleToggle} />
                                    ) : (
                                        <Register handleToggle={handleToggle} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute text-transparent bg-transparent">

                    <button onClick={handleToggle}>
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </div>
            </section>

        </>
    );
};

export default Form;
