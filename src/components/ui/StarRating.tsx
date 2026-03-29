export default function StarRating({ rating, max = 10 }: { rating?: number; max?: number }) {
  const safeRating = rating ?? 0;
  const stars = Math.round((safeRating / max) * 5 * 2) / 2; // half-star precision

  if (!rating) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted">No rating yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className="text-sm">
            {stars >= i ? '★' : stars >= i - 0.5 ? '⯪' : '☆'}
          </span>
        ))}
      </div>
      <span className="text-sm font-semibold text-amber-400">{safeRating.toFixed(1)}</span>
    </div>
  );
}
