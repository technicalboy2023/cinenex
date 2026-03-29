import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Hero skeleton */}
      <Skeleton className="w-full h-[50vh] rounded-xl mb-10" />

      {/* Section skeletons */}
      {[1, 2, 3].map(i => (
        <div key={i} className="mb-10">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex gap-4">
            {Array.from({ length: 5 }, (_, j) => (
              <Skeleton key={j} className="flex-none w-[180px] h-[270px] rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
