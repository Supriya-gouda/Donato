import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Download, Heart } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PointsBadge } from "@/components/shared/PointsBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { Donation, Certificate } from "@/types";
import { toast } from "sonner";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationData, certData] = await Promise.all([
          userService.getDonationHistory(),
          userService.getCertificates(),
        ]);
        setDonations(donationData);
        setCertificates(certData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const updatedUser = await userService.updateProfile(formData);
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageLayout>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card-base p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent overflow-hidden">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-lg">{user?.name}</h2>
                    <PointsBadge badge={user?.badge || "bronze"} size="sm" />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-accent/50 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                    <Heart className="w-5 h-5 text-primary fill-primary" />
                    {user?.points || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
                <div className="bg-accent/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{donations.length}</div>
                  <p className="text-sm text-muted-foreground">Donations</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="input-base pl-10 disabled:bg-muted/50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="input-base pl-10 disabled:bg-muted/50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="input-base pl-10 disabled:bg-muted/50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                      className="input-base pl-10 disabled:bg-muted/50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                {isEditing && (
                  <Button onClick={handleSave} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donation History */}
            <div className="card-base p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Donation History</h3>
              {donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{donation.organizationName}</p>
                        <p className="text-sm text-muted-foreground">
                          {donation.type} • {donation.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {donation.rewardPoints && (
                          <span className="text-sm font-medium text-primary">
                            +{donation.rewardPoints} pts
                          </span>
                        )}
                        <StatusBadge status={donation.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No donations yet. Start making a difference today!
                </p>
              )}
            </div>

            {/* Certificates */}
            <div className="card-base p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Certificates</h3>
              {certificates.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between p-4 bg-accent/50 rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{cert.organizationName}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {cert.donationType} Donation
                        </p>
                        {cert.points && (
                          <p className="text-sm font-medium text-primary mt-1">
                            +{cert.points} points awarded
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(cert.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Complete donations to earn certificates!
                </p>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Profile;
