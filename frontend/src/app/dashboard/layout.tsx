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
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Aguarda checar o localStorage antes de qualquer decisão
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-label-sm text-on-surface-variant">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <Navbar />
      <main className="ml-56 pt-16 min-h-screen">
        <div className="mx-auto max-w-350 px-10 py-8">{children}</div>
      </main>
    </div>
  );
}
