'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { API_BASE } from '@/lib/config';


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
      const res = await fetch(`${API_BASE}/auth/register`, { // add /auth
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, address, password }), // include address
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
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm p-6">
        
        <CardContent>
          <h1 className="text-xl font-bold mb-4">Register</h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button className="w-full" type="submit">Register</Button>
          </form>
          <Button
            variant="link"
            className="mt-2 w-full"
            onClick={() => router.push('/login')}
          >
            Back to login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
