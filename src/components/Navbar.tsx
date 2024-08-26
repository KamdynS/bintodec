'use client';

import Link from 'next/link'
import { Button } from './ui/button'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter();

  return (
    <header className="px-4 py-6 sm:px-6 lg:px-8 border-b">
      <div className="container max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Bin To Dec</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/leaderboard" className="text-sm font-medium hover:underline underline-offset-4">
            Leaderboard
          </Link>
          <Link href="/how-to-play" className="text-sm font-medium hover:underline underline-offset-4">
            How to Play
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          {!session ? (
            <Button onClick={() => signIn('github')} variant="outline">Sign in</Button>
          ) : (
            <>
              <Link href="/profile" className="text-sm font-medium hover:underline underline-offset-4">
                Profile
              </Link>
              <Button onClick={() => signOut()} variant="outline">Sign out</Button>
            </>
          )}
        </nav>
        <Button onClick={() => router.push('/')}>Play Now</Button>
      </div>
    </header>
  )
}