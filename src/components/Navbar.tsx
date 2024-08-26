'use client';

import Link from 'next/link'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
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
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button variant="outline">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign up</Button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link href="/profile" className="text-sm font-medium hover:underline underline-offset-4">
                Profile
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </nav>
        <Button onClick={() => router.push('/')}>Play Now</Button>
      </div>
    </header>
  )
}