"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ReactNode } from "react"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Do nothing while loading
    if (!session) router.push("/")
  }, [session, status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return session ? <>{children}</> : null
}