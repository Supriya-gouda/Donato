import { cn } from "@/lib/utils";
import { Award, Star, Trophy, Crown } from "lucide-react";

interface PointsBadgeProps {
  badge: "bronze" | "silver" | "gold" | "platinum";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const badgeConfig = {
  bronze: {
    label: "Bronze",
    icon: Award,
    className: "bg-amber-700/15 text-amber-700 border-amber-700/30",
    iconColor: "text-amber-700",
  },
  silver: {
    label: "Silver",
    icon: Star,
    className: "bg-slate-400/15 text-slate-500 border-slate-400/30",
    iconColor: "text-slate-500",
  },
  gold: {
    label: "Gold",
    icon: Trophy,
    className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
    iconColor: "text-yellow-600",
  },
  platinum: {
    label: "Platinum",
    icon: Crown,
    className: "bg-violet-500/15 text-violet-600 border-violet-500/30",
    iconColor: "text-violet-600",
  },
};

const sizeConfig = {
  sm: { container: "px-2 py-0.5 text-xs", icon: "w-3 h-3" },
  md: { container: "px-3 py-1 text-sm", icon: "w-4 h-4" },
  lg: { container: "px-4 py-1.5 text-base", icon: "w-5 h-5" },
};

export const PointsBadge: React.FC<PointsBadgeProps> = ({
  badge,
  showLabel = true,
  size = "md",
  className,
}) => {
  const config = badgeConfig[badge];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        config.className,
        sizeStyles.container,
        className
      )}
    >
      <Icon className={cn(sizeStyles.icon, config.iconColor)} />
      {showLabel && config.label}
    </span>
  );
};
