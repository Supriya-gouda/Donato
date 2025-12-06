import { useState, useEffect } from "react";
import { MapPin, Search, Filter } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { OrganizationCard } from "@/components/shared/OrganizationCard";
import { CardSkeleton } from "@/components/shared/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { orgService } from "@/services/orgService";
import { userService } from "@/services/userService";
import { Organization, User } from "@/types";

const Dashboard = () => {
  const { user: authUser, updateUser } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(authUser);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "environment", label: "Environment" },
    { value: "animal-welfare", label: "Animal Welfare" },
    { value: "elderly-care", label: "Elderly Care" },
  ];

  useEffect(() => {
    const fetchUserAndOrganizations = async () => {
      setIsLoading(true);
      try {
        // Step 1: Fetch user profile from database to get current location
        const profile = await userService.getProfile();
        setUserProfile(profile);
        updateUser(profile);
        
        // Step 2: Get user's city/location
        const userCity = profile.location;
        console.log('User location:', userCity);
        
        // Step 3: Fetch organizations in that city
        const data = await orgService.getOrganizations(userCity);
        console.log('Organizations found:', data.length);
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAndOrganizations();
  }, []);

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || org.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageLayout>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back, {userProfile?.name?.split(" ")[0] || "Donor"}!
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{userProfile?.location || "Loading location..."}</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-12"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-base pl-12 pr-10 appearance-none bg-card cursor-pointer min-w-[200px]"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Nearby Organizations ({filteredOrganizations.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredOrganizations.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((org) => (
              <OrganizationCard
                key={org.id}
                organization={org}
                className="animate-fade-in-up"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No organizations found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </PageLayout>
    </div>
  );
};

export default Dashboard;
