import Skeleton from '@/components/ui/Skeleton';

export default function MovieLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <Skeleton className="w-full h-[70vh]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trailer skeleton */}
        <Skeleton className="w-full aspect-video rounded-xl mb-8" />

        {/* Cast skeleton */}
        <Skeleton className="h-8 w-24 mb-4" />
        <div className="flex gap-4 mb-8">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex-none text-center">
              <Skeleton className="w-[120px] h-[120px] rounded-full mb-2" />
              <Skeleton className="h-4 w-20 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
