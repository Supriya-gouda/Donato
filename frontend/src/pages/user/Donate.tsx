import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2, Package, Truck, Calendar, Clock, FileText, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { orgService } from "@/services/orgService";
import { donationService } from "@/services/donationService";
import { Organization } from "@/types";
import { toast } from "sonner";

const donationTypes = [
  { value: "food", label: "Food Items" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books & Stationery" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "medical", label: "Medical Supplies" },
  { value: "monetary", label: "Monetary" },
  { value: "other", label: "Other" },
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const Donate = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    quantity: "",
    deliveryMethod: "dropoff" as "pickup" | "dropoff",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.quantity || !formData.preferredDate || !formData.preferredTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!organization) return;

    setIsSubmitting(true);
    try {
      await donationService.createDonation({
        organizationId: organization.id,
        organizationName: organization.name,
        ...formData,
      });
      setShowSuccess(true);
    } catch (error) {
      toast.error("Failed to submit donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageLayout>
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-64 w-full" />
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageLayout>
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3 animate-fade-in">
              Donation Submitted!
            </h1>
            <p className="text-muted-foreground mb-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Your donation request has been sent to{" "}
              <span className="font-medium text-foreground">{organization.name}</span>
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 text-warning rounded-full text-sm font-medium mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Clock className="w-4 h-4" />
              Status: Pending
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/profile">
                <Button variant="outline">View My Donations</Button>
              </Link>
              <Link to="/dashboard">
                <Button>Continue Exploring</Button>
              </Link>
            </div>
          </div>
        </PageLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageLayout>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to={`/org/${organization.id}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to organization
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Make a Donation</h1>
          </div>

          {/* Organization Info */}
          <div className="card-base p-4 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={organization.logoUrl}
                alt={organization.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm text-muted-foreground">Donating to</p>
                <h2 className="font-semibold text-foreground">{organization.name}</h2>
              </div>
            </div>
          </div>

          {/* Donation Form */}
          <form onSubmit={handleSubmit} className="card-base p-6">
            <div className="space-y-6">
              {/* Donation Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Donation Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-base"
                  required
                >
                  <option value="">Select type</option>
                  {donationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quantity / Value *
                </label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input-base"
                  placeholder="e.g., 10 items, 5kg, ₹500"
                  required
                />
              </div>

              {/* Delivery Method */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  <Truck className="w-4 h-4 inline mr-2" />
                  Delivery Method *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "dropoff", label: "I'll drop off", desc: "Deliver to organization" },
                    { value: "pickup", label: "Request pickup", desc: "Organization collects" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, deliveryMethod: option.value as "pickup" | "dropoff" })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.deliveryMethod === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="input-base"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Preferred Time *
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="input-base"
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-base min-h-[100px] resize-none"
                  placeholder="Any special instructions or details..."
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Donation"}
              </Button>
            </div>
          </form>
        </div>
      </PageLayout>
    </div>
  );
};

export default Donate;
