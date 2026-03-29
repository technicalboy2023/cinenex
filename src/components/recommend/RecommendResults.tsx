import type { RecommendedMovie } from '@/types/recommend';

export default function RecommendResults({ recommendations, query }: { recommendations: RecommendedMovie[]; query: string }) {
  if (!recommendations.length) {
    return (
      <div className="text-center py-12 text-muted">
        <p>No recommendations found for &ldquo;{query}&rdquo;</p>
        <p className="text-sm mt-2">Try a different query or mood.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Recommendations for &ldquo;{query}&rdquo;
      </h3>
      <div className="grid gap-3">
        {recommendations.map((movie, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border
                       hover:border-border-hover hover:bg-card-hover transition-all duration-200
                       animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="flex-none w-8 h-8 rounded-full bg-accent 
                           flex items-center justify-center text-white text-sm font-bold">
              {i + 1}
            </span>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">
                {movie.title}
                {movie.year && <span className="text-muted font-normal ml-2">({movie.year})</span>}
              </h4>
              {movie.reason && (
                <p className="text-sm text-muted mt-1">{movie.reason}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
