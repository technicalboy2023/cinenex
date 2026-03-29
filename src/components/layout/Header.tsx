'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from '@/components/search/SearchBar';
import ThemeToggle from '@/components/shared/ThemeToggle';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // On non-home pages, header is always solid
  const isTransparent = isHomePage && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-gradient-to-b from-black/70 to-transparent'
          : 'bg-background/95 backdrop-blur-xl border-b border-border shadow-sm'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="shrink-0">
              <span className={`text-xl md:text-2xl font-extrabold tracking-tight transition-colors font-heading ${
                isTransparent ? 'text-accent' : 'text-accent'
              }`}>
                CINENEX
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-5">
              {[
                { href: '/', label: 'Home' },
                { href: '/movies', label: 'Movies' },
                { href: '/anime', label: 'Anime' },
                { href: '/recommend', label: 'AI Search' },
                { href: '/watchlist', label: 'Watchlist' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? (isTransparent ? 'text-white font-semibold' : 'text-accent font-semibold')
                      : (isTransparent ? 'text-white/80 hover:text-white' : 'text-muted hover:text-foreground')
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Suspense fallback={<div className="w-56 h-10 rounded-lg bg-card animate-pulse" />}>
                <SearchBar />
              </Suspense>
            </div>
            <ThemeToggle />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isTransparent ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-card-hover'
              }`}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-background border-t border-border overflow-hidden transition-all duration-300 ${
        mobileOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 py-4 space-y-3">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
          <nav className="flex flex-col gap-1 pt-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/movies', label: 'Movies' },
              { href: '/anime', label: 'Anime' },
              { href: '/recommend', label: 'AI Search' },
              { href: '/watchlist', label: 'Watchlist' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-accent/10 text-accent'
                    : 'text-foreground hover:bg-card-hover'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
