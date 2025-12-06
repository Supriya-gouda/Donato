import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
  containerClassName,
}) => {
  return (
    <div className={cn("page-container", className)}>
      <div className={cn("content-container", containerClassName)}>
        {children}
      </div>
    </div>
  );
};
