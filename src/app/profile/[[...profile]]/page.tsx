"use client";

import { useState } from 'react';
import { UserProfile, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function UsernameChange() {
  const { user } = useUser();
  const [username, setUsername] = useState(user?.username || '');

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await user.update({
        username: username,
      });
      alert('Username updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Failed to update username. Please try again.');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Change Username</h2>
      <form onSubmit={handleUsernameChange} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            New Username
          </label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button type="submit">Update Username</Button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Your Profile</h1>
        <UsernameChange />
        <UserProfile path="/profile" routing="path" />
      </main>
    </div>
  );
}