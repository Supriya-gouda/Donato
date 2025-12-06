import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ArrowLeft, AlertTriangle, Gift } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { orgService } from "@/services/orgService";
import { Organization } from "@/types";

const urgencyColors = {
  low: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

const OrganizationDetails = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!orgId) return;
      setIsLoading(true);
      try {
        const data = await orgService.getOrganizationById(orgId);
        setOrganization(data);
      } catch (error) {
        console.error("Error fetching organization:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrganization();
  }, [orgId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageLayout>
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </PageLayout>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageLayout>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Organization not found</h2>
            <Link to="/dashboard">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </PageLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Banner */}
      <div className="relative h-48 sm:h-64 lg:h-80">
        <img
          src={organization.bannerUrl}
          alt={organization.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Back button */}
        <Link
          to="/dashboard"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-4 py-2 bg-card/90 backdrop-blur rounded-xl text-sm font-medium text-foreground hover:bg-card transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <PageLayout className="-mt-16 relative z-10">
        {/* Header Card */}
        <div className="card-base p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={organization.logoUrl}
              alt={organization.name}
              className="w-20 h-20 rounded-2xl border-4 border-card shadow-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {organization.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {organization.location}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
                  {organization.category.replace("-", " ")}
                </span>
              </div>
            </div>
            <Link to={`/donate/${organization.id}`}>
              <Button size="lg" className="w-full sm:w-auto">
                <Gift className="w-5 h-5 mr-2" />
                Donate Now
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
              <p className="text-muted-foreground">{organization.description}</p>
            </div>

            {/* Mission */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">Our Mission</h2>
              <p className="text-muted-foreground">{organization.mission}</p>
            </div>

            {/* Gallery */}
            {organization.images.length > 0 && (
              <div className="card-base p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {organization.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${organization.name} gallery ${index + 1}`}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Donation Needs */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Current Needs</h2>
              {organization.donationNeeds.length > 0 ? (
                <div className="space-y-4">
                  {organization.donationNeeds.map((need) => (
                    <div
                      key={need.id}
                      className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{need.title}</h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${
                              urgencyColors[need.urgency]
                            }`}
                          >
                            {need.urgency} priority
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{need.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No specific needs listed at the moment
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Contact</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Address</p>
                    <p className="text-sm text-muted-foreground">{organization.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">{organization.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">{organization.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Location</h2>
              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Map view coming soon</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Impact</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-accent/50 rounded-xl">
                  <p className="text-2xl font-bold text-foreground">
                    {organization.totalDonations}
                  </p>
                  <p className="text-xs text-muted-foreground">Donations</p>
                </div>
                <div className="text-center p-3 bg-accent/50 rounded-xl">
                  <p className="text-2xl font-bold text-foreground">
                    {new Date().getFullYear() - new Date(organization.createdAt).getFullYear()}+
                  </p>
                  <p className="text-xs text-muted-foreground">Years Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default OrganizationDetails;
