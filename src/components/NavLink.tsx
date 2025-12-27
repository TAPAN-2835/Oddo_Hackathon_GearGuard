import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  active?: boolean;
  icon?: LucideIcon;
}

export function NavLink({ href, label, active, icon: Icon }: NavLinkProps) {
  return (
    <Link
      to={href}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </Link>
  );
}
