import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  showText?: boolean;
  linkTo?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true, linkTo = "/" }) => {
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-soft">
          <Heart className="w-5 h-5 text-primary-foreground fill-current" />
        </div>
      </div>
      {showText && (
        <span className="text-xl font-bold text-gradient">Donatio</span>
      )}
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
};
