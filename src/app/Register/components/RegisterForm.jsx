'use client'

import { useState } from 'react'
import { Field, Label, Switch } from '@headlessui/react'
import ButtonFill from '@/app/components/Buttons/Button_fill/ButtonFill'
import Link from 'next/link'
import ButtonBorder from '@/app/components/Buttons/Button_border/ButtonBorder'
import { toast } from 'react-toastify'
import { registerUser } from '@/app/actions/auth/registerUser'
import SocialLogin from '@/app/components/SocialLogin/SocialLogin'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function RegisterForm() {
  const [agreed, setAgreed] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const name = form.get('name')
    const email = form.get('email')
    const password = form.get('password')

    if (!agreed) {
      return toast.error('Please agree to the privacy policy.')
    }

    const userData = { name, email, password }
    const result = await registerUser(userData)

    if (result.success) {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (res.ok) {
        toast.success('Registration successful!')
        router.push('/')
      } else {
        toast.error('Login failed after registration')
      }
    } else {
      toast.error(result.error || 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-2">
        {/* Name */}
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm/6 font-semibold">
            Name
          </label>
          <div className="mt-2.5">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="given-name"
              className="block w-full rounded-md px-3.5 py-2 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:opacity-50 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              required
            />
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="sm:col-span-2">
          <label htmlFor="password" className="block text-sm/6 font-semibold">
            Password
          </label>
          <div className="mt-2.5">
            <div className="flex rounded-md outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Type your password here"
                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base placeholder:opacity-50 focus:outline-none sm:text-sm/6"
                required
              />
            </div>
          </div>
        </div>

        {/* Policy Switch */}
        <Field className="flex gap-x-4 sm:col-span-2">
          <div className="flex h-6 items-center">
            <Switch
              checked={agreed}
              onChange={setAgreed}
              className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-gray-900/5 transition-colors duration-200 ease-in-out ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-checked:bg-indigo-600"
            >
              <span className="sr-only">Agree to policies</span>
              <span
                aria-hidden="true"
                className="size-4 transform rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-checked:translate-x-3.5"
              />
            </Switch>
          </div>
          <Label className="text-sm/6">
            By selecting this, you agree to our{' '}
            <a href="#" className="font-semibold underline underline-offset-2">
              privacy&nbsp;policy
            </a>
            .
          </Label>
        </Field>
      </div>

      {/* Submit Button */}
      <div className="mt-10">
        <button type="submit" className="w-full">
          <ButtonFill>Register</ButtonFill> {/* ✅ FIXED label */}
        </button>
      </div>

      {/* OR divider */}
      <div className="my-5 text-center text-gray-400">Or Sign in with</div>

      {/* Google Login */}
      <SocialLogin />

      {/* Redirect buttons */}
      <div className="flex flex-wrap gap-5">
        {/* Go back to home */}
        <div className="form-control mt-4 text-sm">
          <Link href="/">
            <ButtonBorder>Go Back to Home</ButtonBorder>
          </Link>
        </div>

        {/* Already have account */}
        <div className="form-control mt-4 text-sm">
          <Link href="/Login">
            <ButtonBorder>Already have an account? Login</ButtonBorder>
          </Link>
        </div>
      </div>
    </form>
  )
}
