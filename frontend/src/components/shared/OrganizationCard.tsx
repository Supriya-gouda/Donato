import { Link } from "react-router-dom";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { Organization } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrganizationCardProps {
  organization: Organization;
  className?: string;
}

const categoryColors: Record<string, string> = {
  education: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  healthcare: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  environment: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "animal-welfare": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "poverty-relief": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "disaster-relief": "bg-red-500/10 text-red-600 border-red-500/20",
  "elderly-care": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  other: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  className,
}) => {
  const categoryStyle = categoryColors[organization.category] || categoryColors.other;

  return (
    <div
      className={cn(
        "card-interactive group overflow-hidden",
        className
      )}
    >
      {/* Banner Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={organization.bannerUrl}
          alt={organization.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
        
        {/* Logo */}
        <div className="absolute bottom-0 left-4 translate-y-1/2">
          <img
            src={organization.logoUrl}
            alt={`${organization.name} logo`}
            className="w-14 h-14 rounded-xl border-4 border-card object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-10">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-1">
            {organization.name}
          </h3>
          <span
            className={cn(
              "shrink-0 px-2 py-0.5 text-xs font-medium rounded-full border capitalize",
              categoryStyle
            )}
          >
            {organization.category.replace("-", " ")}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span>{organization.location}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {organization.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{organization.totalDonations} donations</span>
          </div>
          
          <Link to={`/org/${organization.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10 group/btn"
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
