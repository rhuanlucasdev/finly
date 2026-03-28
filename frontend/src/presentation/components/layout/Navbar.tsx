"use client";

import { useAuth } from "@/presentation/providers/AuthProvider";

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="fixed left-56 right-0 top-0 z-30 flex h-16 items-center justify-between bg-surface px-8">
      <p className="text-label-md text-on-surface-variant font-medium">
        Dashboard Overview
      </p>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-chip bg-surface-container px-4 py-2">
          <div className="h-7 w-7 rounded-full bg-primary-container flex items-center justify-center">
            <span className="text-xs font-bold text-on-primary">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-label-md text-on-surface font-medium">
            {user?.name?.split(" ")[0]} Profile
          </span>
        </div>
      </div>
    </header>
  );
}
