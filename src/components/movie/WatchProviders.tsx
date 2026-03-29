import Image from 'next/image';
import { imageUrl } from '@/lib/tmdb';
import type { WatchProviderRegion } from '@/types/movie';

export default function WatchProviders({ providers, link }: { providers: WatchProviderRegion; link?: string }) {
  const hasProviders = providers.flatrate?.length || providers.rent?.length || providers.buy?.length;
  if (!hasProviders) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Where to Watch</h2>
        {(link || providers.link) && (
          <a
            href={link || providers.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all options ↗
          </a>
        )}
      </div>

      <div className="space-y-6">
        {providers.flatrate && providers.flatrate.length > 0 && (
          <ProviderRow label="Stream" providers={providers.flatrate} />
        )}
        {providers.rent && providers.rent.length > 0 && (
          <ProviderRow label="Rent" providers={providers.rent} />
        )}
        {providers.buy && providers.buy.length > 0 && (
          <ProviderRow label="Buy" providers={providers.buy} />
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Streaming data provided by{' '}
        <a href="https://www.justwatch.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          JustWatch
        </a>
      </p>
    </section>
  );
}

function ProviderRow({ label, providers }: { label: string; providers: { logoPath: string; providerName: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted mb-3">{label}</h3>
      <div className="flex gap-3 flex-wrap">
        {providers.map((p, i) => (
          <div
            key={i}
            className="group relative w-12 h-12 rounded-xl overflow-hidden border border-border transition-colors hover:border-border-hover border-border 
                       hover:border-white/30 transition-all duration-300 hover:scale-110"
            title={p.providerName}
          >
            <Image
              src={imageUrl(p.logoPath, 'w92')}
              alt={p.providerName || 'Provider Logo'}
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
