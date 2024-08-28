"use client";

import { UserProfile } from "@clerk/nextjs";
import UsernameChange from '../../../components/UsernameChange';
import UserTopScores from '../../../components/UserTopScores';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Your Profile</h1>
        <UsernameChange />
        <UserTopScores />
        <UserProfile path="/profile" routing="path" />
      </main>
    </div>
  );
}