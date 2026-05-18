export default function BeatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-xl animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-br from-[#141416] to-[#0b0b12]" />
      <div className="relative flex h-full flex-col justify-between p-3 xs:p-4 sm:p-5 min-h-[160px]">
        <div className="flex items-start justify-end">
          <div className="h-5 w-16 rounded-full bg-white/10" />
        </div>
        <div className="min-w-0 space-y-2 mt-4">
          <div className="h-4 w-3/4 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/10" />
          <div className="mt-3 flex gap-2">
            <div className="h-5 w-14 rounded-full bg-white/10" />
            <div className="h-5 w-12 rounded-full bg-white/10" />
            <div className="h-5 w-10 rounded-full bg-white/10" />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/10" />
            <div className="h-8 w-8 rounded-full bg-white/10" />
            <div className="h-8 w-8 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
