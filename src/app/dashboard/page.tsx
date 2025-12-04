'use client';

import React, { useEffect, useState } from 'react';
import { getToken, logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/config';

interface Position {
  position_id?: number;
  position_code: string;
  position_name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [positionCode, setPositionCode] = useState('');
  const [positionName, setPositionName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    fetchPositions();
  }, [router]);

  function authHeaders() {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  }

  async function fetchPositions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/positions`, {
        method: 'GET',
        headers: authHeaders(),
      });

      if (res.status === 401) {
        logoutUser();
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

      const data = await res.json();
      setPositions(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch positions');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload: Position = {
      position_code: positionCode,
      position_name: positionName,
    };

    try {
      let res;

      if (editingId) {
        res = await fetch(`${API_BASE}/positions/${editingId}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/positions`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      }

      if (res.status === 401) {
        logoutUser();
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setPositionCode('');
      setPositionName('');
      setEditingId(null);
      await fetchPositions();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    }
  }

  function startEdit(p: Position) {
    setEditingId(p.position_id ?? null);
    setPositionCode(p.position_code);
    setPositionName(p.position_name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm('Delete this position?')) return;

    try {
      const res = await fetch(`${API_BASE}/positions/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (res.status === 401) {
        logoutUser();
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      await fetchPositions();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setPositionCode('');
    setPositionName('');
  }

  function handleLogout() {
    logoutUser();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1c1c1c] p-8 text-white">

      {/* CONTAINER */}
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-10 rounded-2xl p-6 bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl">
          <h1 className="text-4xl font-bold tracking-wider text-blue-400 drop-shadow-blue-glow">
            Positions Dashboard
          </h1>

          <div className="flex gap-4">
            <button
              onClick={fetchPositions}
              className="px-6 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-500 transition-all font-semibold shadow-blue-glow"
            >
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 transition-all font-semibold shadow-blue-glow"
            >
              Logout
            </button>
          </div>
        </header>

        {/* FORM CARD */}
        <section className="mb-12 p-8 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 text-blue-300 tracking-wide drop-shadow-blue-glow">
            {editingId ? 'Edit Position' : 'Create Position'}
          </h2>

          <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <input
              className="bg-white/10 text-white rounded-xl px-4 py-3 font-medium backdrop-blur-md placeholder-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Position Code"
              value={positionCode}
              onChange={(e) => setPositionCode(e.target.value)}
              required
            />

            <input
              className="bg-white/10 text-white rounded-xl px-4 py-3 font-medium backdrop-blur-md placeholder-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Position Name"
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
              required
            />

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-blue-glow"
              >
                {editingId ? 'Update' : 'Create'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-white/10 border border-blue-400 rounded-xl font-bold text-blue-300 hover:bg-blue-600/40 hover:text-white transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {error && <p className="mt-4 text-blue-300 font-medium">{error}</p>}
        </section>

        {/* TABLE */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-blue-300 tracking-wide drop-shadow-blue-glow">
            Positions List {loading && '(loading...)'}
          </h2>

          <div className="overflow-x-auto rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-white/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/20">
                  <th className="px-6 py-4 text-blue-200 font-semibold">ID</th>
                  <th className="px-6 py-4 text-blue-200 font-semibold">Code</th>
                  <th className="px-6 py-4 text-blue-200 font-semibold">Name</th>
                  <th className="px-6 py-4 text-blue-200 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {positions.map((p, idx) => (
                  <tr
                    key={p.position_id}
                    className="border-b border-white/10 hover:bg-blue-600/20 transition-all"
                  >
                    <td className="px-6 py-4 font-mono">{p.position_id}</td>
                    <td className="px-6 py-4">{p.position_code}</td>
                    <td className="px-6 py-4">{p.position_name}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => startEdit(p)}
                          className="px-4 py-1 rounded-lg bg-blue-500/30 text-blue-200 border border-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(p.position_id)}
                          className="px-4 py-1 rounded-lg bg-red-500/30 text-red-300 border border-red-500 hover:bg-red-600 hover:text-white transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {positions.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-blue-200">
                      No positions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      <style jsx global>{`
        .shadow-blue-glow {
          box-shadow: 0 0 12px rgba(0, 130, 255, 0.45);
        }
        .drop-shadow-blue-glow {
          text-shadow: 0 0 10px rgba(0, 140, 255, 0.9);
        }
      `}</style>
    </div>
  );
}
