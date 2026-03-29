import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex px-6 py-3 rounded-xl font-semibold text-foreground
                     bg-gradient-to-r from-blue-600 to-purple-600 
                     hover:from-blue-500 hover:to-purple-500
                     shadow-lg shadow-blue-500/25 transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
