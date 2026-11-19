'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await register(name, email, password, phone);

    if (res.success) {
      router.push('/account/orders');
      router.refresh();
    } else {
      setError(res.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-premium border border-neutral-200 space-y-6">
        <div className="text-center">
          <Logo size="md" variant="dark" href="/" />
          <h2 className="font-serif text-2xl font-bold text-neutral-900 mt-4 uppercase tracking-tight">
            Create An Account
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Join the Radhey Radhey Girls Point VIP circle.
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
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                required
                placeholder="e.g. Pooja Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                placeholder="pooja@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Mobile Number (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Register'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
          Already have an account?{' '}
          <Link href="/account/login" className="font-semibold text-black underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
