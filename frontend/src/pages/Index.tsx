import { Link } from "react-router-dom";
import { Heart, MapPin, Award, Users, ArrowRight, Building2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-accent/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full mb-6 animate-fade-in">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                Make a difference in your community
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
              Connect, Donate,{" "}
              <span className="text-gradient">Transform Lives</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Donatio connects generous donors with impactful organizations in your area. 
              Every donation earns rewards and makes a real difference.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Donating
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/org/signup">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Building2 className="w-5 h-5" />
                  Register Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How Donatio Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple, rewarding way to support causes you care about
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MapPin,
                title: "Discover Nearby",
                description: "Find verified organizations in your area that need your help",
              },
              {
                icon: Gift,
                title: "Donate Items",
                description: "Contribute food, clothes, books, or make monetary donations",
              },
              {
                icon: Award,
                title: "Earn Rewards",
                description: "Get points and badges for every donation you make",
              },
              {
                icon: Users,
                title: "Track Impact",
                description: "See your contribution history and certificates",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="card-base p-6 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-base gradient-hero p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">
              Ready to make an impact?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Join thousands of donors who are transforming their communities one donation at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/org/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white bg-transparent text-white hover:bg-white hover:text-primary">
                  Register Your NGO
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Donatio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
