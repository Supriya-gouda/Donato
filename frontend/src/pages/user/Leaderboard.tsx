import { useState, useEffect } from "react";
import { Trophy, MapPin, Medal } from "lucide-react";
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
  { value: "Delhi", label: "Delhi, India" },
];

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("all");

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
    if (rank === 1) return "bg-yellow-500/10 border-yellow-500/30";
    if (rank === 2) return "bg-slate-400/10 border-slate-400/30";
    if (rank === 3) return "bg-amber-700/10 border-amber-700/30";
    return "";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-muted-foreground font-medium">{rank}</span>;
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
                  <div
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4",
                      index === 0 && "bg-yellow-500/20",
                      index === 1 && "bg-slate-400/20",
                      index === 2 && "bg-amber-700/20"
                    )}
                  >
                    {getRankIcon(entry.rank)}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {entry.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-primary">(You)</span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{entry.location}</p>
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
                  <th className="px-4 py-4 text-left text-sm font-semibold text-foreground hidden sm:table-cell">
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
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              getRankStyle(entry.rank)
                            )}
                          >
                            {getRankIcon(entry.rank)}
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
                        <td className="px-4 py-4 text-muted-foreground hidden sm:table-cell">
                          {entry.location}
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
