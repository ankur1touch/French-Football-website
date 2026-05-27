import Skeleton from "./Skeleton";

export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
