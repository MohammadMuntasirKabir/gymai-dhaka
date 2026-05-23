import { Link, useLocation } from "react-router-dom";
import { Home, MapPin, Dumbbell, User } from "lucide-react";
import { useAuth } from "../../context/useAuth";

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Don't show on auth pages
  if (pathname.startsWith("/auth") || pathname.startsWith("/account")) return null;

  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/gyms", icon: MapPin, label: "Gyms" },
    { to: user ? "/profile" : "/auth/sign-in", icon: Dumbbell, label: "My Plan" },
    { to: user ? "/account/profile" : "/auth/sign-in", icon: User, label: user ? "Account" : "Sign In" },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md safe-area-pb">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const isActive = pathname === item.to || (item.to === "/profile" && pathname.startsWith("/profile"));
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? "text-accent" : "text-muted"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
