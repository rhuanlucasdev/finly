"use client";

import { Navbar } from "@/presentation/components/layout/Navbar";
import { Sidebar } from "@/presentation/components/layout/Sidebar";
import { useAuth } from "@/presentation/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <Navbar />
      <main className="ml-56 pt-16">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
