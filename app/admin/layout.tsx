'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search, ShieldCheck, RefreshCw } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isStaffOrAdmin } = useAuth();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !isLoginPage) {
      if (!user || !isStaffOrAdmin) {
        router.push('/admin/login');
      }
    }
  }, [user, loading, isLoginPage, isStaffOrAdmin, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#F7F7F7]">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141517] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-neutral-400" />
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isStaffOrAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#F7F7F7] text-neutral-900 font-sans">
      {/* Dark Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-neutral-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-900 uppercase tracking-wider">
              Radhey Radhey Girls Point
            </span>
            <span>/</span>
            <span className="capitalize">{pathname.replace('/admin', '') || 'Dashboard'}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>System Operational</span>
            </div>
            <div className="text-xs text-neutral-500 hidden sm:block">
              Welcome, <strong className="text-neutral-900">{user.name}</strong> ({user.role})
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
