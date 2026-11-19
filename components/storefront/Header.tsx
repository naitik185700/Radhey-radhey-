'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  LayoutDashboard,
} from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  subcategories?: { id: string; name: string; slug: string }[];
}

export default function Header() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { totalItems, setIsCartOpen, wishlistIds } = useCart();
  const { user, logout, isStaffOrAdmin } = useAuth();

  // Fetch categories dynamically from backend
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories in header:', err);
      }
    }
    loadCategories();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border shadow-subtle transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Mobile Hamburger Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-brand-dark hover:text-black focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo - Centered or Left */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <Logo size="md" variant="dark" href="/" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium tracking-wide">
              <Link
                href="/"
                className={`transition-colors py-1 ${
                  pathname === '/' ? 'text-black font-semibold border-b-2 border-black' : 'text-neutral-700 hover:text-black'
                }`}
              >
                Home
              </Link>
              <Link
                href="/shop?newArrival=true"
                className={`transition-colors py-1 ${
                  pathname.includes('newArrival') ? 'text-black font-semibold border-b-2 border-black' : 'text-neutral-700 hover:text-black'
                }`}
              >
                New Arrivals
              </Link>

              {/* Dynamic categories from database */}
              {categories.slice(0, 6).map((cat) => (
                <div key={cat.id} className="relative group py-2">
                  <Link
                    href={`/category/${cat.slug}`}
                    className={`flex items-center gap-1 transition-colors ${
                      pathname === `/category/${cat.slug}` ? 'text-black font-semibold border-b-2 border-black' : 'text-neutral-700 hover:text-black'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </Link>

                  {/* Dropdown Menu for Subcategories */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="absolute top-full left-0 w-48 py-2 bg-white rounded-md shadow-elevated border border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <Link
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-50"
                      >
                        All {cat.name}
                      </Link>
                      <div className="h-[1px] bg-neutral-100 my-1"></div>
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.slug}?subcategory=${sub.slug}`}
                          className="block px-4 py-2 text-sm text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                href="/shop?sale=true"
                className="text-red-700 hover:text-red-800 font-semibold tracking-wider uppercase text-xs px-2.5 py-1 bg-red-50 rounded"
              >
                Sale
              </Link>
            </nav>

            {/* Quick Actions (Search, Account, Wishlist, Cart) */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-neutral-800 hover:text-black transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Customer Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="p-2 text-neutral-800 hover:text-black transition-colors flex items-center gap-1"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5" />
                  {user && (
                    <span className="hidden xl:inline text-xs font-medium max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  )}
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-elevated border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-neutral-100 text-neutral-700 rounded">
                            {user.role}
                          </span>
                        </div>

                        {isStaffOrAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-900 font-medium hover:bg-neutral-100 transition-colors bg-neutral-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-brand-dark" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <Link
                          href="/account/orders"
                          onClick={() => setIsAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-neutral-400" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          href="/account/wishlist"
                          onClick={() => setIsAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-neutral-400" />
                          <span>My Wishlist ({wishlistIds.length})</span>
                        </Link>

                        <div className="border-t border-neutral-100 my-1"></div>
                        <button
                          onClick={() => {
                            setIsAccountOpen(false);
                            logout();
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <div className="p-3 space-y-2">
                        <Link
                          href="/account/login"
                          onClick={() => setIsAccountOpen(false)}
                          className="block w-full py-2 px-3 text-center text-sm font-medium bg-black text-white rounded hover:bg-neutral-800 transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/account/register"
                          onClick={() => setIsAccountOpen(false)}
                          className="block w-full py-2 px-3 text-center text-xs font-medium text-neutral-700 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
                        >
                          Create Account
                        </Link>
                        <div className="pt-2 border-t border-neutral-100">
                          <Link
                            href="/admin/login"
                            onClick={() => setIsAccountOpen(false)}
                            className="block text-center text-xs text-neutral-500 hover:text-black underline"
                          >
                            Store Admin Portal →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Icon */}
              <Link
                href="/account/wishlist"
                className="p-2 text-neutral-800 hover:text-black transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistIds.length > 0 && (
                  <span className="absolute top-1 right-1 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-neutral-800 hover:text-black transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Bar Overlay */}
        {isSearchOpen && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 animate-in fade-in slide-in-from-top-1">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search pure silk suits, kurti sets, anarkalis, dresses, lehengas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-24 py-2.5 bg-white border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-5 space-y-4">
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-base font-semibold text-neutral-900 border-b border-neutral-100"
              >
                Home
              </Link>
              <Link
                href="/shop?newArrival=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-neutral-700 border-b border-neutral-100"
              >
                New Arrivals
              </Link>
              {categories.map((cat) => (
                <div key={cat.id} className="py-1">
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-base font-medium text-neutral-800 hover:text-black"
                  >
                    {cat.name}
                  </Link>
                </div>
              ))}
              <Link
                href="/shop?sale=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-base font-bold text-red-600"
              >
                Festive Sale %
              </Link>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <div className="flex flex-col gap-2">
                {user ? (
                  <>
                    <p className="text-xs text-neutral-500">Signed in as {user.name}</p>
                    {isStaffOrAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-2 px-3 text-center text-sm font-semibold bg-neutral-900 text-white rounded"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="py-2 text-left text-sm text-red-600 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2.5 text-center text-sm font-semibold bg-black text-white rounded"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/account/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2.5 text-center text-sm font-semibold border border-neutral-300 rounded"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
