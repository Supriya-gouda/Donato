import { useState, useEffect, useRef } from "react";
import { Building2, Mail, Phone, MapPin, FileText, Edit2, Save, X, Image, Users, Upload, Trash2 } from "lucide-react";
import { OrgNavbar } from "@/components/shared/OrgNavbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getOrgProfile, updateOrgProfile } from "@/services/orgBackendService";
import { toast } from "sonner";

const OrgProfile = () => {
  const { organization, updateOrg } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mission: "",
    category: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    registration_number: "",
    logo_url: "",
    banner_url: "",
    website_url: "",
    total_received: 0,
    donor_count: 0,
    images: [] as string[],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getOrgProfile();
      if (response.success) {
        const profile = response.data;
        setFormData({
          name: profile.name || "",
          description: profile.description || "",
          mission: profile.mission || "",
          category: profile.category || "",
          email: profile.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          address: profile.address || "",
          registration_number: profile.registration_number || "",
          logo_url: profile.logo_url || "",
          banner_url: profile.banner_url || "",
          website_url: profile.website_url || "",
          total_received: profile.total_received || 0,
          donor_count: profile.donor_count || 0,
          images: profile.images || [],
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await updateOrgProfile(formData);
      if (response.success) {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
        // Update local context if needed
        if (updateOrg) {
          updateOrg(response.data);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      
      // Convert image to base64 or upload to a service
      // For now, we'll use a placeholder URL generator
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result as string;
        
        // Add to images array
        const updatedImages = [...formData.images, imageUrl];
        const updatedFormData = { ...formData, images: updatedImages };
        
        // Save to backend
        const response = await updateOrgProfile({ images: updatedImages });
        if (response.success) {
          setFormData(updatedFormData);
          toast.success("Image uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageDelete = async (index: number) => {
    try {
      const updatedImages = formData.images.filter((_, i) => i !== index);
      const response = await updateOrgProfile({ images: updatedImages });
      if (response.success) {
        setFormData({ ...formData, images: updatedImages });
        toast.success("Image deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadingLogo(true);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result as string;
        
        const response = await updateOrgProfile({ logo_url: imageUrl });
        if (response.success) {
          setFormData({ ...formData, logo_url: imageUrl });
          toast.success("Logo updated successfully!");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadingBanner(true);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result as string;
        
        const response = await updateOrgProfile({ banner_url: imageUrl });
        if (response.success) {
          setFormData({ ...formData, banner_url: imageUrl });
          toast.success("Banner updated successfully!");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Failed to upload banner");
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) {
        bannerInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <OrgNavbar />
      <PageLayout>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card-base overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary/20 to-accent relative" 
                   style={formData.banner_url ? { 
                     backgroundImage: `url(${formData.banner_url})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center'
                   } : {}}>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-card/80 backdrop-blur"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={uploadingBanner}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-card/80 backdrop-blur"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                  </Button>
                </div>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </div>
              <div className="px-6 pb-6">
                <div className="flex items-end gap-4 -mt-10 mb-4">
                  <div className="relative">
                    <img
                      src={formData.logo_url || "https://via.placeholder.com/80"}
                      alt={formData.name}
                      className="w-20 h-20 rounded-2xl border-4 border-card object-cover shadow-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                    >
                      <Upload className="w-3 h-3" />
                    </Button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1 pb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-base text-xl font-bold"
                      />
                    ) : (
                      <h1 className="text-xl font-bold text-foreground">{formData.name}</h1>
                    )}
                    <p className="text-sm text-muted-foreground capitalize">
                      {formData.category?.replace("-", " ")}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-accent/50 rounded-xl">
                    <p className="text-2xl font-bold text-foreground">
                      {formData.total_received || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Received</p>
                  </div>
                  <div className="text-center p-4 bg-accent/50 rounded-xl">
                    <p className="text-2xl font-bold text-foreground">
                      {formData.donor_count || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Donors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Mission */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">About Organization</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-base min-h-[100px] resize-none"
                    />
                  ) : (
                    <p className="text-foreground">{formData.description || "No description"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Mission
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.mission}
                      onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                      className="input-base min-h-[100px] resize-none"
                    />
                  ) : (
                    <p className="text-foreground">{formData.mission || "No mission statement"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <p className="text-foreground">{formData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-base"
                    />
                  ) : (
                    <p className="text-foreground">{formData.phone || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="input-base"
                    />
                  ) : (
                    <p className="text-foreground">{formData.location || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Registration
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.registration_number}
                      onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                      className="input-base"
                    />
                  ) : (
                    <p className="text-foreground">{formData.registration_number || "Not provided"}</p>
                  )}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Website URL
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      className="input-base"
                      placeholder="https://example.org"
                    />
                  ) : (
                    <p className="text-foreground">{formData.website_url || "Not provided"}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Full Address
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-base resize-none"
                    rows={2}
                  />
                ) : (
                  <p className="text-foreground">{formData.address || "Not provided"}</p>
                )}
              </div>
              {isEditing && (
                <div className="mt-6">
                  <Button onClick={handleSave} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Gallery Preview */}
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Gallery</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingImage ? "Uploading..." : "Upload"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {formData.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleImageDelete(index)}
                        className="absolute top-1 right-1 p-1 bg-destructive/90 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 bg-muted rounded-xl flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No images uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </PageLayout>
    </div>
  );
};

export default OrgProfile;
