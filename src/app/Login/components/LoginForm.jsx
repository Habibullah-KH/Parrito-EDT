'use client'
import ButtonFill from '@/app/components/Buttons/Button_fill/ButtonFill';
import { signIn } from "next-auth/react"
import Link from 'next/link';
import ButtonBorder from '@/app/components/Buttons/Button_border/ButtonBorder';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import SocialLogin from '@/app/components/SocialLogin/SocialLogin';

export default function RegisterForm(){
      const router = useRouter();
      const handleSubmit = async (e)=>{
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get('email'); 
        const password = form.get('password');
        try{
        const response = await signIn("credentials", 
            {email, password, callbackUrl: "/", redirect:false});
            if(response.ok){
              toast.success("Logged In Successfully")
              router.push("/");
              form.reset();
            } else {
              toast.error("Authentication Failed");
            }

        }
        catch (error){
        console.log(error);  
        toast.error(error)
        }
      }

    return(
        <>
    <form
     onSubmit={handleSubmit}
      className=" mx-auto max-w-xl mt-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm/6 font-semibold">
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-md px-3.5 py-2 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:opacity-50 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                required
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="password" className="block text-sm/6 font-semibold">
              Password
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <input
                  id="password"
                  name="password"
                  type="text"
                  placeholder="type you password here"
                  className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base placeholder:opacity-50 focus:outline-none sm:text-sm/6"
                  required
                />
              </div>
            </div>
          </div>

        </div>
        <div className="mt-10">
          <button
            type="submit" className='w-full'>
            <ButtonFill>Login</ButtonFill>
          </button>
        </div>

        <div className='my-5 text-center text-gray-400'>
            Or continue in with
        </div>

        {/* google login */}
<SocialLogin/>

{/* redirect buttons */}
<div className='flex flex-wrap gap-5'>

{/* go back to home button */}
<div className="form-control mt-4 text-sm">
<Link
href="/"
>
<ButtonBorder>
Go Back to Home
</ButtonBorder>
</Link>
</div>

{/* redirect to login page */}
<div className="form-control mt-4 text-sm">
<Link
href="/register"
>
<ButtonBorder>
Don't have accout register first
</ButtonBorder>
</Link>
</div>
</div> 
      </form>
        </>
    );
}