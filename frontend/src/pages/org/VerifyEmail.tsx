import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { toast } from "sonner";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Try to get email from localStorage or navigation state
    const savedOrg = localStorage.getItem("organization");
    if (savedOrg) {
      try {
        const org = JSON.parse(savedOrg);
        setEmail(org.email);
      } catch (error) {
        console.error("Error parsing organization:", error);
      }
    }
  }, []);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      // This would call your backend API to resend verification email
      // For now, we'll just show a success message
      toast.success("Verification email resent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            Verify Your Email Address
          </h1>

          <p className="text-muted-foreground mb-6">
            We've sent a verification email to:
          </p>

          <p className="text-foreground font-medium mb-6 break-all">
            {email || "your email address"}
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  Click the verification link in the email to activate your account.
                </p>
                <p>
                  If you don't see the email, check your spam folder.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleResendVerification}
            variant="outline"
            className="w-full mb-4"
            disabled={isResending}
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </Button>

          <div className="text-sm text-muted-foreground">
            Already verified?{" "}
            <Link to="/org/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <a href="mailto:support@donatio.com" className="text-primary hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
