import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "accepted" | "rejected" | "completed";
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-warning/15 text-warning border-warning/30",
  },
  accepted: {
    label: "Accepted",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  completed: {
    label: "Completed",
    className: "bg-success/15 text-success border-success/30",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "badge-status border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
