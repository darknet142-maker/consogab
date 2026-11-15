import { Home, MapPin, QrCode, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  {
    id: "home",
    icon: Home,
    label: "Accueil",
  },
  {
    id: "map",
    icon: MapPin,
    label: "Carte",
  },
  {
    id: "scanner",
    icon: QrCode,
    label: "Scanner",
    isMain: true,
  },
  {
    id: "profile",
    icon: User,
    label: "Profil",
  },
];

export const BottomNavigation = ({
  activeTab,
  onTabChange,
}: BottomNavigationProps) => {
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/20 safe-area-pb z-[var(--z-sticky)] noselect"
      style={{ zIndex: "var(--z-sticky)" }}
    >
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-2 px-3 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                item.isMain
                  ? "relative bg-primary text-primary-foreground shadow-lg scale-110 rounded-full p-3"
                  : isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-6 h-6" />
              <span
                className={cn(
                  "text-xs mt-1 font-medium",
                  item.isMain ? "text-primary-foreground" : ""
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};