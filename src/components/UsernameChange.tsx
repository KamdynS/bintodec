import { useState } from 'react';
import {  useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UsernameChange() {
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