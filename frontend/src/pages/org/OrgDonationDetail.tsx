import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Package, Truck, Calendar, Clock, FileText, CheckCircle, XCircle, Award, Gift } from "lucide-react";
import { OrgNavbar } from "@/components/shared/OrgNavbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { getOrgDonationById } from "@/services/orgBackendService";
import { donationService } from "@/services/donationService";
import { Donation } from "@/types";
import { toast } from "sonner";

const OrgDonationDetail = () => {
  const { donationId } = useParams<{ donationId: string }>();
  const navigate = useNavigate();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rewardPoints, setRewardPoints] = useState("");
  const [showCompleteForm, setShowCompleteForm] = useState(false);

  useEffect(() => {
    const fetchDonation = async () => {
      if (!donationId) return;
      setIsLoading(true);
      try {
        console.log('Fetching donation:', donationId);
        const response = await getOrgDonationById(donationId);
        console.log('Donation response:', response);
        
        if (response.success && response.data) {
          // Transform backend data to frontend format
          const backendData = response.data;
          const transformedDonation: Donation = {
            id: backendData.id,
            donorId: backendData.donor_id,
            donorName: backendData.user_profiles?.name || 'Unknown Donor',
            organizationId: backendData.organization_id,
            organizationName: 'Your Organization',
            type: backendData.donation_type || 'items',
            quantity: backendData.quantity || backendData.item_description || 'N/A',
            deliveryMethod: backendData.delivery_method || 'dropoff',
            preferredDate: backendData.preferred_date || backendData.created_at,
            preferredTime: backendData.preferred_time || '10:00 AM',
            notes: backendData.notes || backendData.description || '',
            status: backendData.status,
            rewardPoints: backendData.reward_points,
            certificateUrl: backendData.certificate_url,
            createdAt: backendData.created_at,
            updatedAt: backendData.updated_at || backendData.created_at
          };
          
          console.log('Transformed donation:', transformedDonation);
          setDonation(transformedDonation);
        } else {
          console.error('No donation data found');
          setDonation(null);
        }
      } catch (error) {
        console.error("Error fetching donation:", error);
        toast.error("Failed to load donation details");
        setDonation(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonation();
  }, [donationId]);

  const handleStatusUpdate = async (status: "accepted" | "rejected") => {
    if (!donation) return;
    setIsUpdating(true);
    try {
      const updated = await donationService.updateDonationStatus(donation.id, status);
      setDonation(updated);
      toast.success(`Donation ${status}!`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleComplete = async () => {
    if (!donation || !rewardPoints) {
      toast.error("Please enter reward points");
      return;
    }
    setIsUpdating(true);
    try {
      const updated = await donationService.updateDonationStatus(
        donation.id,
        "completed",
        parseInt(rewardPoints)
      );
      setDonation(updated);
      toast.success("Donation completed! Certificate generated.");
      setShowCompleteForm(false);
    } catch (error) {
      toast.error("Failed to complete donation");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <OrgNavbar />
        <PageLayout>
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-64 w-full" />
        </PageLayout>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-background">
        <OrgNavbar />
        <PageLayout>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Donation not found</h2>
            <Link to="/org/dashboard">
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
      <OrgNavbar />
      <PageLayout>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/org/dashboard"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Donation Request
              </h1>
              <StatusBadge status={donation.status} />
            </div>
          </div>

          {/* Donor Info */}
          <div className="card-base p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Donor Information</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground text-lg">{donation.donorName}</p>
                <p className="text-sm text-muted-foreground">Donor ID: {donation.donorId}</p>
              </div>
            </div>
          </div>

          {/* Donation Details */}
          <div className="card-base p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Donation Details</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium text-foreground capitalize">{donation.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium text-foreground">{donation.quantity}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Method</p>
                  <p className="font-medium text-foreground capitalize">
                    {donation.deliveryMethod === "pickup" ? "Pickup Requested" : "Drop-off"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(donation.preferredDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Time</p>
                  <p className="font-medium text-foreground">{donation.preferredTime}</p>
                </div>
              </div>
            </div>
            {donation.notes && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium text-foreground">{donation.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {donation.status === "pending" && (
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Actions</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleStatusUpdate("accepted")}
                  disabled={isUpdating}
                  className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Accept Donation
                </Button>
                <Button
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={isUpdating}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}

          {donation.status === "accepted" && (
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Mark as Completed</h2>
              {showCompleteForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Award className="w-4 h-4 inline mr-2" />
                      Reward Points
                    </label>
                    <input
                      type="number"
                      value={rewardPoints}
                      onChange={(e) => setRewardPoints(e.target.value)}
                      className="input-base"
                      placeholder="Enter points (e.g., 100)"
                      min="1"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handleComplete} disabled={isUpdating} className="flex-1">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Complete & Generate Certificate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCompleteForm(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowCompleteForm(true)} className="w-full">
                  Mark as Completed
                </Button>
              )}
            </div>
          )}

          {donation.status === "completed" && (
            <div className="card-base p-6 bg-success/5 border-success/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-success" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Donation Completed!</h2>
                  <p className="text-muted-foreground">
                    {donation.rewardPoints} points awarded • Certificate generated
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageLayout>
    </div>
  );
};

export default OrgDonationDetail;
