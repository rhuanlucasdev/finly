"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  TrendingUp,
  Settings,
  Wallet,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/presentation/providers/AuthProvider";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  { label: "Goals", href: "/dashboard/goals", icon: Target },
  { label: "Investments", href: "/dashboard/investments", icon: TrendingUp },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col bg-surface-lowest">
      {/* Logo */}
      <div className="px-6 pt-8 pb-10">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <span className="text-title-lg text-on-surface">Finly</span>
        </div>
        <p className="text-label-sm text-on-surface-variant mt-0.5 tracking-widest uppercase">
          Private Wealth
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-card px-4 py-3 text-label-md transition-all",
                active
                  ? "bg-primary text-on-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Add Transaction CTA */}
      <div className="px-3 py-4">
        <button
          className="w-full flex items-center justify-center gap-2 rounded-chip py-3 px-4 text-label-md font-semibold text-on-primary"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
          }}
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>

      {/* Footer */}
      <div className="px-3 pb-6 space-y-1">
        <button className="w-full flex items-center gap-3 rounded-card px-4 py-3 text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all">
          <HelpCircle className="h-4 w-4" />
          Help
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-card px-4 py-3 text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
