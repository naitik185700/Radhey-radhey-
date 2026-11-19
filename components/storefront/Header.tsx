'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronRight,
  LogOut,
  Package,
  LayoutDashboard,
  MessageCircle,
  MapPin,
  Sparkles,
  Tag,
} from 'lucide-react';
import Logo from '@/components/shared/Logo';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  subcategories?: Subcategory[];
}

export default function Header() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
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

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsAccountOpen(false);
    setIsMoreOpen(false);
  }, [pathname]);

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Primary categories to show on desktop (first 5)
  const primaryCategories = categories.slice(0, 5);
  // Secondary categories placed into "More Collections" dropdown to keep layout 100% responsive
  const secondaryCategories = categories.slice(5);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-22 gap-2 sm:gap-4">
            
            {/* 1. Mobile Left: Hamburger Menu & Quick Search */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-neutral-800 hover:text-black rounded-md focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-neutral-800 hover:text-black rounded-md focus:outline-none"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Brand Logo (Centered on mobile, Left on desktop) */}
            <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
              <Logo size="header" variant="dark" href="/" />
            </div>

            {/* 3. Desktop Navigation Links (Clean, Balanced & Never Overcrowded) */}
            <nav className="hidden lg:flex items-center space-x-3 xl:space-x-5 2xl:space-x-7 text-xs xl:text-sm font-medium tracking-wide">
              <Link
                href="/"
                className={`py-1 transition-colors whitespace-nowrap ${
                  pathname === '/'
                    ? 'text-black font-semibold border-b-2 border-black'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                Home
              </Link>

              <Link
                href="/shop?newArrival=true"
                className={`py-1 transition-colors whitespace-nowrap flex items-center gap-1 ${
                  pathname.includes('newArrival')
                    ? 'text-black font-semibold border-b-2 border-black'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                <span>New Arrivals</span>
              </Link>

              {/* Dynamic Primary Categories */}
              {primaryCategories.map((cat) => (
                <div key={cat.id} className="relative group py-2">
                  <Link
                    href={`/category/${cat.slug}`}
                    className={`flex items-center gap-1 transition-colors whitespace-nowrap py-1 ${
                      pathname === `/category/${cat.slug}`
                        ? 'text-black font-semibold border-b-2 border-black'
                        : 'text-neutral-700 hover:text-black'
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
                          className="block px-4 py-2 text-xs text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Secondary Categories ("More Collections" Dropdown) */}
              {secondaryCategories.length > 0 && (
                <div className="relative group py-2">
                  <button
                    className="flex items-center gap-1 text-neutral-700 hover:text-black py-1 transition-colors whitespace-nowrap"
                  >
                    <span>More</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  <div className="absolute top-full right-0 w-52 py-2 bg-white rounded-md shadow-elevated border border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <span className="block px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      More Collections
                    </span>
                    {secondaryCategories.map((sec) => (
                      <Link
                        key={sec.id}
                        href={`/category/${sec.slug}`}
                        className="block px-4 py-2 text-xs text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                      >
                        {sec.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Festive Sale Link */}
              <Link
                href="/shop?sale=true"
                className="text-red-700 hover:text-red-800 font-semibold tracking-wider uppercase text-[11px] xl:text-xs px-2.5 py-1 bg-red-50 hover:bg-red-100 rounded transition-colors whitespace-nowrap"
              >
                Sale %
              </Link>
            </nav>

            {/* 4. Desktop & Mobile Action Icons */}
            <div className="flex items-center space-x-1 sm:space-x-3 xl:space-x-4">
              {/* Search Toggle (Desktop) */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden lg:flex p-2 text-neutral-800 hover:text-black transition-colors rounded-full hover:bg-neutral-100"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Customer Account Dropdown */}
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="p-2 text-neutral-800 hover:text-black transition-colors flex items-center gap-1 rounded-full hover:bg-neutral-100"
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
                          className="block w-full py-2 px-3 text-center text-xs font-semibold uppercase tracking-wider bg-black text-white rounded hover:bg-neutral-800 transition-colors"
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
                            Admin Dashboard Portal →
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
                className="p-2 text-neutral-800 hover:text-black transition-colors relative rounded-full hover:bg-neutral-100"
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
                className="p-2 text-neutral-800 hover:text-black transition-colors relative rounded-full hover:bg-neutral-100"
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

        {/* Live Search Bar Dropdown Overlay */}
        {isSearchOpen && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 animate-in fade-in slide-in-from-top-1">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search pure silk suits, kurti sets, anarkalis, dresses, lehengas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-24 py-2 bg-white border border-neutral-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3.5 py-1.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* 5. Mobile Navigation Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {/* Top Bar of Drawer */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
              <Logo size="header" variant="dark" href="/" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input inside Mobile Menu */}
            <div className="p-4 border-b border-neutral-100">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search suits, kurtis, co-ords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-100 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </form>
            </div>

            {/* Scrollable Category & Navigation List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 text-sm">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 font-semibold text-neutral-900 border-b border-neutral-100"
              >
                <span>Home</span>
              </Link>

              <Link
                href="/shop?newArrival=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 font-medium text-neutral-800 border-b border-neutral-100"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>New Arrivals</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                  New In
                </span>
              </Link>

              <Link
                href="/shop?sale=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 font-bold text-red-600 border-b border-neutral-100"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-red-600" />
                  <span>Festive Sale %</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                  Special Offers
                </span>
              </Link>

              {/* Dynamic Categories with Accordion */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Shop Collections
                </span>

                {categories.map((cat) => {
                  const hasSub = cat.subcategories && cat.subcategories.length > 0;
                  const isExpanded = expandedMobileCat === cat.id;

                  return (
                    <div key={cat.id} className="border-b border-neutral-100">
                      <div className="flex items-center justify-between py-2.5">
                        <Link
                          href={`/category/${cat.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="font-medium text-neutral-800 hover:text-black flex-1"
                        >
                          {cat.name}
                        </Link>

                        {hasSub && (
                          <button
                            onClick={() => setExpandedMobileCat(isExpanded ? null : cat.id)}
                            className="p-1 text-neutral-400 hover:text-black"
                            aria-label={`Toggle ${cat.name} subcategories`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>
                        )}
                      </div>

                      {hasSub && isExpanded && (
                        <div className="pl-4 pb-2 space-y-1.5 bg-neutral-50/60 rounded-md my-1 py-1.5">
                          <Link
                            href={`/category/${cat.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider"
                          >
                            View All {cat.name}
                          </Link>
                          {cat.subcategories!.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/category/${cat.slug}?subcategory=${sub.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-1 text-xs text-neutral-600 hover:text-black"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Drawer Footer: WhatsApp Support & Address */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <a
                href="https://wa.me/918950729243?text=Hello%20Radhey%20Radhey%20Girls%20Point%2C%20I%20have%20an%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>WhatsApp Order: +91 89507 29243</span>
              </a>

              <div className="text-[11px] text-neutral-500 space-y-1">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
                  <span>Near Sach Jewellers, Pul Teliyan, Hisar</span>
                </p>
              </div>

              {/* User Account / Login inside mobile menu */}
              <div className="pt-2 border-t border-neutral-200 flex justify-between text-xs">
                {user ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-neutral-700 font-medium truncate max-w-[150px]">
                      {user.name}
                    </span>
                    <button
                      onClick={() => logout()}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <Link
                      href="/account/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-neutral-900 font-semibold hover:underline"
                    >
                      Sign In
                    </Link>
                    <span className="text-neutral-300">|</span>
                    <Link
                      href="/account/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-neutral-600 hover:text-black hover:underline"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
