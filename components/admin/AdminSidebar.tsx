'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Boxes,
  ClipboardList,
  Users,
  Tag,
  Image as ImageIcon,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { useAuth } from '@/context/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Orders', href: '/admin/orders', icon: ClipboardList },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Coupons & Offers', href: '/admin/coupons', icon: Tag },
    { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#141517] text-neutral-300 flex flex-col justify-between h-screen sticky top-0 border-r border-neutral-800 flex-shrink-0 z-30 select-none">
      {/* Top Brand Logo */}
      <div className="p-6 border-b border-neutral-800/80 text-center">
        <Logo size="sm" variant="light" href="/admin" />
        <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-neutral-800 border border-neutral-700/60 text-[10px] font-semibold uppercase tracking-widest text-neutral-300">
          Admin Dashboard
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Actions */}
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded text-xs text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Store</span>
          </span>
          <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded">Live</span>
        </Link>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 px-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-semibold text-white truncate max-w-[100px]">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-neutral-400 truncate max-w-[100px]">
                {user?.role || 'ADMIN'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
