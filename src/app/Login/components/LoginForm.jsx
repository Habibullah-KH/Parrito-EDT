'use client'
import { useState } from 'react'
import { Field, Label, Switch } from '@headlessui/react'
import ButtonFill from '@/app/components/Buttons/Button_fill/ButtonFill';
import Link from 'next/link';
import ButtonBorder from '@/app/components/Buttons/Button_border/ButtonBorder';
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify';
import { registerUser } from '@/app/actions/auth/registerUser';

export default function RegisterForm(){
      const [agreed, setAgreed] = useState(false)

      const handleSubmit = async (e)=>{
        e.preventDefault();
        const form = new FormData(e.target);
        const firstName = form.get('first-name'); 
        const lastName = form.get('last-name'); 
        const email = form.get('email'); 
        const password = form.get('password');
        if(!agreed){
            return toast.error('please agree privacy policy');
        }
        const userData = {firstName, lastName, email, password}
        await registerUser(userData);
      }
    return(
        <>
    <form
     onSubmit={handleSubmit}
      className="mx-auto mt-16 max-w-xl sm:mt-20">
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

        <div className='mt-5 text-center text-gray-400'>
            Or continue in with
        </div>

        {/* google login */}
        <div className="form-control mt-5 w-full">
           <button className='w-full'>
            <ButtonFill>
            <div className='flex items-center justify-center gap-2'><FcGoogle/> Sign in with google</div>
            </ButtonFill>
            </button>
         </div>

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
href="/Register"
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