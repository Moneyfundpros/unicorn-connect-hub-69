import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TrackProps {
  analyticsKey?: string;
  name: string;
}

type TrackedButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  intent?: "primary" | "secondary";
} & TrackProps;

export const TrackedButtonLink = ({
  analyticsKey,
  children,
  name,
  href,
  className,
  intent = "primary",
  ...props
}: TrackedButtonLinkProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(`Tracked event: ${name}`);
    if (href.startsWith('/')) {
      navigate(href);
    } else {
      window.open(href, '_blank');
    }
  };

  return (
    <Button 
      className={className} 
      variant={intent === "primary" ? "default" : "outline"}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};