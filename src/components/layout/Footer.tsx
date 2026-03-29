import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="text-xl font-extrabold text-accent tracking-tight">CINENEX</span>
            <p className="text-muted text-sm mt-3 max-w-md leading-relaxed">
              Discover trending movies & anime, watch trailers, find where to stream,
              and get AI-powered recommendations. Your ultimate movie companion.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-foreground font-semibold text-sm mb-3">Explore</h4>
            <div className="flex flex-col gap-2">
              <FooterLink href="/">Trending</FooterLink>
              <FooterLink href="/movies">Movies</FooterLink>
              <FooterLink href="/anime">Anime</FooterLink>
              <FooterLink href="/recommend">AI Search</FooterLink>
              <FooterLink href="/watchlist">My Watchlist</FooterLink>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-semibold text-sm mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted">
                This product uses the TMDb API but is not endorsed or certified by TMDb.
              </span>
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                The Movie Database ↗
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} CineNex. All rights reserved. Movie data provided by TMDb.
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-muted hover:text-foreground transition-colors duration-200">
      {children}
    </Link>
  );
}
