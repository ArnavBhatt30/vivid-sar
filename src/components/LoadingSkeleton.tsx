import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => (
  <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
    <div className="mb-6 sm:mb-8">
      <Skeleton className="h-7 w-32 mb-2" />
      <Skeleton className="h-4 w-56" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-28 sm:h-32 rounded-xl sm:rounded-2xl" />
      ))}
    </div>
    <div className="grid lg:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <Skeleton className="h-52 rounded-xl sm:rounded-2xl" />
      <Skeleton className="h-52 rounded-xl sm:rounded-2xl" />
    </div>
    <Skeleton className="h-64 rounded-xl sm:rounded-2xl" />
  </div>
);

export const GallerySkeleton = () => (
  <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
    <div className="mb-6 sm:mb-8">
      <Skeleton className="h-7 w-24 mb-2" />
      <Skeleton className="h-4 w-48" />
    </div>
    <div className="flex items-center gap-3 mb-5 sm:mb-6">
      <Skeleton className="h-10 flex-1 rounded-xl" />
      <Skeleton className="h-10 w-20 rounded-lg" />
    </div>
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-xl sm:rounded-2xl" />
      ))}
    </div>
  </div>
);

export const MapSkeleton = () => (
  <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <Skeleton className="h-7 w-28 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-9 w-36 rounded-lg" />
    </div>
    <Skeleton className="h-[350px] sm:h-[500px] md:h-[600px] rounded-xl sm:rounded-2xl" />
  </div>
);
