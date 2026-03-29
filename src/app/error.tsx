'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😢</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">Failed to load data</h1>
        <p className="text-muted mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl font-semibold text-foreground
                     bg-gradient-to-r from-blue-600 to-purple-600 
                     hover:from-blue-500 hover:to-purple-500
                     shadow-lg shadow-blue-500/25 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
