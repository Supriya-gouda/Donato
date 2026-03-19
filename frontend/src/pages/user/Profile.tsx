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

  const handleDownloadCertificate = async (cert: Certificate) => {
    try {
      // Create a simple certificate HTML
      const certificateContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Certificate - ${cert.organizationName}</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              padding: 60px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
            }
            .certificate {
              background: white;
              padding: 60px;
              max-width: 800px;
              margin: 0 auto;
              border: 20px solid #f0f0f0;
              box-shadow: 0 0 30px rgba(0,0,0,0.2);
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .title {
              font-size: 48px;
              color: #667eea;
              font-weight: bold;
              margin: 20px 0;
            }
            .subtitle {
              font-size: 18px;
              color: #666;
              margin-bottom: 10px;
            }
            .content {
              text-align: center;
              margin: 40px 0;
              line-height: 1.8;
              font-size: 18px;
            }
            .recipient {
              font-size: 36px;
              color: #333;
              font-weight: bold;
              margin: 30px 0;
              border-bottom: 2px solid #667eea;
              display: inline-block;
              padding-bottom: 10px;
            }
            .details {
              margin: 30px 0;
              padding: 20px;
              background: #f9f9f9;
              border-radius: 10px;
            }
            .detail-item {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              padding: 10px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .detail-label {
              font-weight: bold;
              color: #666;
            }
            .detail-value {
              color: #333;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              color: #999;
              font-size: 14px;
            }
            .signature {
              margin-top: 60px;
              display: flex;
              justify-content: space-around;
            }
            .signature-block {
              text-align: center;
            }
            .signature-line {
              width: 200px;
              border-top: 2px solid #333;
              margin: 0 auto 10px;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="subtitle">Certificate of Appreciation</div>
              <div class="title">DONATION CERTIFICATE</div>
              <div class="subtitle">This certifies that</div>
            </div>
            
            <div class="content">
              <div class="recipient">${user?.name || 'Donor'}</div>
              <p>has generously contributed to</p>
              <h2 style="color: #667eea; margin: 20px 0;">${cert.organizationName}</h2>
              <p>with their valuable donation</p>
            </div>
            
            <div class="details">
              <div class="detail-item">
                <span class="detail-label">Donation Type:</span>
                <span class="detail-value">${cert.donationType?.toUpperCase() || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Certificate Number:</span>
                <span class="detail-value">${cert.certificateNumber || cert.id}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date Issued:</span>
                <span class="detail-value">${new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              ${cert.points ? `
              <div class="detail-item">
                <span class="detail-label">Points Awarded:</span>
                <span class="detail-value">${cert.points} Points</span>
              </div>` : ''}
            </div>
            
            <div class="signature">
              <div class="signature-block">
                <div class="signature-line"></div>
                <p style="margin: 5px 0; font-weight: bold;">Organization Representative</p>
                <p style="margin: 0; font-size: 12px; color: #666;">${cert.organizationName}</p>
              </div>
              <div class="signature-block">
                <div class="signature-line"></div>
                <p style="margin: 5px 0; font-weight: bold;">Verified By</p>
                <p style="margin: 0; font-size: 12px; color: #666;">Donate Connect Platform</p>
              </div>
            </div>
            
            <div class="footer">
              <p>This certificate acknowledges a charitable donation.</p>
              <p>Certificate ID: ${cert.id}</p>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create a blob and download
      const blob = new Blob([certificateContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate_${cert.organizationName.replace(/\s+/g, '_')}_${cert.id}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate");
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
                      <Button variant="ghost" size="icon" onClick={() => handleDownloadCertificate(cert)}>
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
