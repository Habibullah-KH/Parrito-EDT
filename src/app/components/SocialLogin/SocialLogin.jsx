import React, { useEffect } from 'react'
import { FcGoogle } from "react-icons/fc";
import ButtonFill from '../Buttons/Button_fill/ButtonFill';
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default  function SocialLogin() {

    const router = useRouter();
    const session = useSession();
    const handleSocialLogin = async (providerName) => {
        signIn(providerName);
    };

    useEffect(() => {
        if(session?.status == "authenticated"){
            router.push("/");
            toast.success("Successfully Logged IN")
        }
    }, [session?.status])
  return (

<button 
onClick={() => handleSocialLogin("google")}
className='w-full'
 >
<ButtonFill>
<div className='flex items-center justify-center gap-2'><FcGoogle/> Sign in wigoogle</div>
</ButtonFill>
</button>

  )
}
