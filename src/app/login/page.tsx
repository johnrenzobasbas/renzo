'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { saveToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { API_BASE } from '@/lib/config';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ← DITO MO ILALAGAY ANG FUNCTION, replacing old function
  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("Response:", res.status, data);

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      saveToken(data.accessToken);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Network error. Check API server.');
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm p-6">
        <CardContent>
          <h1 className="text-xl font-bold mb-4">Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button className="w-full" type="submit">Login</Button>
          </form>
          <Button variant="link" className="mt-2 w-full" onClick={() => router.push('/register')}>
            Create an account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
