import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gift, Clock, CheckCircle, Award, ArrowRight, User } from "lucide-react";
import { OrgNavbar } from "@/components/shared/OrgNavbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getOrgDashboard, getPendingDonations, getDonationStats } from "@/services/orgBackendService";
import { Donation } from "@/types";

const OrgDashboard = () => {
  const { organization } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    pendingDonations: 0,
    completedDonations: 0,
    totalPointsGiven: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching org dashboard data...');
        const dashboardResponse = await getOrgDashboard();
        
        console.log('Dashboard response:', dashboardResponse);
        
        if (dashboardResponse.success) {
          const { stats, recent_donations } = dashboardResponse.data;
          
          console.log('Stats:', stats);
          console.log('Recent donations:', recent_donations);
          
          setDonations(recent_donations || []);
          setStats({
            totalDonations: stats.total_donations || 0,
            pendingDonations: stats.pending_donations || 0,
            completedDonations: stats.completed_donations || 0,
            totalPointsGiven: stats.total_points_given || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (organization?.id) {
      fetchData();
    }
  }, [organization?.id]);

  const statCards = [
    {
      label: "Total Donations",
      value: stats.totalDonations,
      icon: Gift,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Pending",
      value: stats.pendingDonations,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Completed",
      value: stats.completedDonations,
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Points Given",
      value: stats.totalPointsGiven,
      icon: Award,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <OrgNavbar />
      <PageLayout>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome, {organization?.name || "Organization"}!
          </h1>
          <p className="text-muted-foreground">
            Manage incoming donations and reward your donors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28" />
              ))
            : statCards.map((stat, index) => (
                <div
                  key={stat.label}
                  className="card-base p-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
        </div>

        {/* Donation Requests */}
        <div className="card-base">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Incoming Donation Requests
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : donations.length > 0 ? (
            <div className="divide-y divide-border">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {donation.user_profiles?.name || 'Anonymous Donor'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {donation.donation_type || 'N/A'} {donation.amount && `• $${donation.amount}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {donation.description || 'No description'} •{" "}
                        {new Date(donation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={donation.status} />
                    {donation.certificates?.[0]?.points_awarded && (
                      <span className="text-sm text-muted-foreground">
                        {donation.certificates[0].points_awarded} pts
                      </span>
                    )}
                    <Link to={`/org/donations/${donation.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary">
                        View
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No donations yet
              </h3>
              <p className="text-muted-foreground">
                Donation requests will appear here when donors contribute
              </p>
            </div>
          )}
        </div>
      </PageLayout>
    </div>
  );
};

export default OrgDashboard;
