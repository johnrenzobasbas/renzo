'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { API_BASE } from '@/lib/config';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, address, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Register failed');
        return;
      }

      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  }

  return (
    <div className="relative flex items-center justify-center h-screen">
      {/* Background Image */}
      <Image
        src="/pic1.jpg"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Register Card */}
      <Card className="relative w-full max-w-sm p-6 bg-gradient-to-b from-blue-900 to-black text-white backdrop-blur-md z-10 shadow-lg">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-white">Register</h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/20 text-white placeholder-white border-blue-500 focus:border-blue-300"
            />
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-black/20 text-white placeholder-white border-blue-500 focus:border-blue-300"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/20 text-white placeholder-white border-blue-500 focus:border-blue-300"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button className="w-full bg-blue-700 hover:bg-blue-600 text-white" type="submit">
              Register
            </Button>
          </form>

          <Button
            variant="link"
            className="mt-2 w-full text-white hover:text-blue-200"
            onClick={() => router.push('/login')}
          >
            Back to login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
