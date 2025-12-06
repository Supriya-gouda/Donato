import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "bg-muted/60 rounded-xl animate-pulse",
        className
      )}
    />
  );
};

export const CardSkeleton = () => (
  <div className="card-base p-4">
    <Skeleton className="h-32 mb-4" />
    <Skeleton className="h-5 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const TableRowSkeleton = () => (
  <tr>
    <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
    <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
    <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
    <td className="px-4 py-3"><Skeleton className="h-6 w-16 rounded-full" /></td>
  </tr>
);
