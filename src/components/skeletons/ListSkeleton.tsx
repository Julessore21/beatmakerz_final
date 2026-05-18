import BeatCardSkeleton from "./BeatCardSkeleton";

interface ListSkeletonProps {
  count?: number;
}

export default function ListSkeleton({ count = 12 }: ListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <BeatCardSkeleton key={i} />
      ))}
    </div>
  );
}
