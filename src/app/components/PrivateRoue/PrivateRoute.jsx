'use client'

import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PrivateRoute({ children }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/`)
    }
  }, [status, pathname, router])

  if (status === "loading") {
    return <div className="text-center py-20">Loading...</div>
  }

  if (status === "authenticated") {
    return children
  }

  return null // Prevents flash of protected content
}
