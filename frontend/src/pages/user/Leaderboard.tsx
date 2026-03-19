import { useState, useEffect } from "react";
import { Trophy, MapPin, Medal, User } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { PointsBadge } from "@/components/shared/PointsBadge";
import { TableRowSkeleton } from "@/components/shared/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { donationService } from "@/services/donationService";
import { LeaderboardEntry } from "@/types";
import { cn } from "@/lib/utils";

const locations = [
  { value: "all", label: "All Locations" },
  { value: "Pune", label: "Pune, India" },
  { value: "Mumbai", label: "Mumbai, India" },
  { value: "Bangalore", label: "Bangalore, India" },
  { value: "Bengaluru", label: "Bengaluru, India" },
  { value: "Delhi", label: "Delhi, India" },
];

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("all");

  // Helper function to format location display
  const formatLocation = (location: string | undefined): string => {
    if (!location) return 'N/A';
    
    // If already has ", India", return as is
    if (location.includes(', India')) return location;
    
    // Capitalize first letter and add ", India"
    const capitalized = location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
    return `${capitalized}, India`;
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await donationService.getLeaderboard(selectedLocation);
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedLocation]);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/10 border-yellow-500/30 border-2";
    if (rank === 2) return "bg-slate-400/10 border-slate-400/30 border-2";
    if (rank === 3) return "bg-amber-700/10 border-amber-700/30 border-2";
    return "bg-muted/50 border border-border";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />;
    return <span className="text-foreground font-semibold text-sm">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageLayout>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Top donors making an impact in their communities
            </p>
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="input-base pl-12 pr-10 appearance-none bg-card cursor-pointer min-w-[200px]"
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top 3 Cards */}
        {!isLoading && leaderboard.length >= 3 && (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {leaderboard.slice(0, 3).map((entry, index) => {
              const isCurrentUser = entry.userId === user?.id;
              return (
                <div
                  key={entry.userId}
                  className={cn(
                    "card-base p-6 text-center animate-fade-in-up",
                    isCurrentUser && "ring-2 ring-primary",
                    index === 0 && "sm:order-2",
                    index === 1 && "sm:order-1",
                    index === 2 && "sm:order-3"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative mx-auto mb-4 w-20 h-20">
                    <div
                      className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center",
                        index === 0 && "bg-yellow-500/20",
                        index === 1 && "bg-slate-400/20",
                        index === 2 && "bg-amber-700/20"
                      )}
                    >
                      <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg",
                        index === 0 && "bg-yellow-500",
                        index === 1 && "bg-slate-400",
                        index === 2 && "bg-amber-700"
                      )}
                    >
                      {index === 0 && <Trophy className="w-4 h-4 text-white" />}
                      {index === 1 && <Medal className="w-4 h-4 text-white" />}
                      {index === 2 && <Medal className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {entry.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-primary">(You)</span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{formatLocation(entry.location)}</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                      {entry.points.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">pts</span>
                  </div>
                  <div className="mt-3">
                    <PointsBadge badge={entry.badge} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Table */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                    Rank
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                    Donor
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                    Location
                  </th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-foreground">
                    Points
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-foreground">
                    Badge
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
                ) : (
                  leaderboard.map((entry) => {
                    const isCurrentUser = entry.userId === user?.id;
                    return (
                      <tr
                        key={entry.userId}
                        className={cn(
                          "border-b border-border/50 transition-colors hover:bg-muted/30",
                          isCurrentUser && "bg-primary/5"
                        )}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-base",
                                entry.rank === 1 && "bg-yellow-500/20 border-2 border-yellow-500/50",
                                entry.rank === 2 && "bg-slate-400/20 border-2 border-slate-400/50",
                                entry.rank === 3 && "bg-amber-700/20 border-2 border-amber-700/50",
                                entry.rank > 3 && "bg-muted/50 border border-border"
                              )}
                            >
                              {entry.rank === 1 ? <Trophy className="w-6 h-6 text-yellow-500" /> :
                               entry.rank === 2 ? <Medal className="w-6 h-6 text-slate-400" /> :
                               entry.rank === 3 ? <Medal className="w-6 h-6 text-amber-700" /> :
                               <span className="text-foreground font-bold">{entry.rank}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-medium text-foreground">
                            {entry.name}
                          </span>
                          {isCurrentUser && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                              You
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {formatLocation(entry.location)}
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-foreground">
                          {entry.points.toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <PointsBadge badge={entry.badge} showLabel={false} size="sm" />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Leaderboard;
