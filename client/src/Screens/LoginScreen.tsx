import React, { useEffect, useState } from 'react'
import HoverMoveContainer from '../SharedComponents/HoverMoveContainer'
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginOrSignUp } from '../Api/authApi';

const LoginScreen = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const handleAuth = async () => {
                try {
                  await loginOrSignUp({ uId: user.uid, email: user.email, photoURL: user.photoURL, displayName: user.displayName });
                  navigate("/dashboard");
                  setLoading(true)
                } catch (err) {
                  console.error(err);
                  setLoading(false)
                }
            };
            handleAuth()
        }
    }, [user, navigate]);


  const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const { uid, displayName, email, photoURL } = result.user;
        setUser({ uid, displayName, email, photoURL });
    } catch (error) {
        console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className='flex flex-col w-[100vw] h-[100vh] justify-center items-center'>
        <div className='absolute'>
            <HoverMoveContainer 
                className='w-[calc(100vw-1rem)] h-[calc(100vh-1rem)] 
                    bg-gradient-to-r from-[#BFECFF] to-[#CDC1FF]
                    rounded-xl shadow-xl 
                    flex items-center justify-center
                 '
                sensitivity={0.2}
                >
                <div className=''>
                </div>
            </HoverMoveContainer>
        </div>
        <div className='absolute top-30 left-1/2 -translate-x-1/2'>
            <div className='flex flex-col gap-[20vh] justify-center items-center'>
                <HoverMoveContainer 
                    className='
                        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent
                        flex items-center justify-center
                        font-bold text-gray-900 tracking-tight  text-4xl  sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4
                    '
                    sensitivity={0.6}
                    whileHover={{scale: 1.1}}
                    doesTilt
                    initial={{opacity: 0, y: -100}}
                    >
                    <div className=''>
                        Trip Journal
                    </div>
                </HoverMoveContainer>

                <HoverMoveContainer 
                    sensitivity={1}
                    whileHover={{scale: 1.2}}
                    doesTilt
                    initial={{opacity: 0, y: -100}}
                    >
                    <button className="group flex items-center gap-3 px-6 py-3 border border-gray-300 rounded-lg shadow-xl bg-white hover:bg-gray-100 transition"
                        onClick={signInWithGoogle}>
                        <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.2H272v95h146.9c-6.4 34.8-25.5 64.2-54.4 83.9v69.5h87.9c51.5-47.4 81.1-117.2 81.1-198.2z"/>
                            <path fill="#34A853" d="M272 544.3c73.7 0 135.4-24.4 180.5-66.2l-87.9-69.5c-24.4 16.3-55.6 25.8-92.6 25.8-71 0-131.2-47.9-152.7-112.1H30.6v70.4c45.1 88.9 137.9 151.6 241.4 151.6z"/>
                            <path fill="#FBBC05" d="M119.3 321.9c-10.3-30.1-10.3-62.5 0-92.6V158.9H30.6c-36.4 71.9-36.4 157.8 0 229.7l88.7-66.7z"/>
                            <path fill="#EA4335" d="M272 107.7c39.9-.6 78.2 14.3 107.7 41.6l80.6-80.6C413.5 24.6 344.8-1 272 0 168.5 0 75.7 62.7 30.6 151.6l88.7 66.7C140.8 155.6 201 107.7 272 107.7z"/>
                        </svg>
                        <span className="text-2xl text-gray-700 group-hover:text-gray-500 font-large">Sign in with Google</span>
                    </button>

                    
                </HoverMoveContainer>
            </div>

        </div>
    </div>
  )
}

export default LoginScreen