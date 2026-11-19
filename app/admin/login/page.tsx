'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@radheygirlspoint.com');
  const [password, setPassword] = useState('Admin@123Password!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password, 'ADMIN');

    if (res.success) {
      router.push('/admin');
      router.refresh();
    } else {
      setError(res.error || 'Access denied. Administrator privileges required.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111214] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1A1C1E] border border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center">
          <Logo size="md" variant="light" href="/admin/login" />
          <div className="mt-4 inline-block px-3 py-1 bg-neutral-800 text-neutral-300 text-xs font-semibold uppercase tracking-widest rounded-full border border-neutral-700">
            Administrative Portal
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-3">
            Store Management Sign In
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Restricted area for boutique owners & store staff.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@radheygirlspoint.com"
                className="w-full bg-[#141517] border border-neutral-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#141517] border border-neutral-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="p-3 bg-neutral-900/80 rounded-lg border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
          <p className="font-semibold text-neutral-300">Default Demo Credentials:</p>
          <p>Email: <span className="text-white font-mono">admin@radheygirlspoint.com</span></p>
          <p>Password: <span className="text-white font-mono">Admin@123Password!</span></p>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            &larr; Return to Public Customer Store
          </Link>
        </div>
      </div>
    </div>
  );
}
