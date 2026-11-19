'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);

    if (res.success) {
      router.push('/account/orders');
      router.refresh();
    } else {
      setError(res.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-premium border border-neutral-200 space-y-6">
        <div className="text-center">
          <Logo size="md" variant="dark" href="/" />
          <h2 className="font-serif text-2xl font-bold text-neutral-900 mt-4 uppercase tracking-tight">
            Customer Sign In
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Access your orders, saved addresses, and wishlist.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-neutral-100 text-center space-y-2 text-xs">
          <p className="text-neutral-500">
            Don&#39;t have an account yet?{' '}
            <Link href="/account/register" className="font-semibold text-black underline">
              Create an Account
            </Link>
          </p>

          <div className="pt-2">
            <Link
              href="/admin/login"
              className="text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              Store Administrator / Staff Login &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
