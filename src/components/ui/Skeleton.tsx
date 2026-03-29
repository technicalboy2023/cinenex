export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-shimmer bg-gradient-to-r from-card via-card-hover to-card rounded-lg ${className}`} />
  );
}
