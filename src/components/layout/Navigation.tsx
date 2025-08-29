import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  History, 
  Settings, 
  LogOut,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Search, label: "New Scan", path: "/scan" },
    { icon: History, label: "History", path: "/history" },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">TinyCrawl</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center space-x-2",
                  location.pathname === item.path && "bg-secondary text-secondary-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-muted-foreground">
              {user?.email}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex justify-center space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center space-y-1 h-auto py-2",
                  location.pathname === item.path && "bg-secondary text-secondary-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}