"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-surface-raised rounded-2xl animate-pulse ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-raised border border-wire-subtle p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-12 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function SlideSkeleton() {
  return (
    <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-raised border border-wire-subtle">
      <Skeleton className="w-4 h-4 rounded" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-2.5 w-8" />
        <Skeleton className="h-3.5 w-24" />
      </div>
    </div>
  );
}
