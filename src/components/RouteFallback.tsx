import { Skeleton, SkeletonRow } from "@/components/ui/skeleton";

export function RouteFallback() {
  return (
    <div className="flex flex-1 flex-col p-4 gap-4">
      <Skeleton className="h-6 w-1/2" />
      <div className="flex flex-col gap-1">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
      <Skeleton className="h-40 w-full rounded-card" />
    </div>
  );
}
