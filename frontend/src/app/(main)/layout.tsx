"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NavTabs } from "@/components/navigation/nav-tabs";
import Image from "next/image";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout, address } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <MainSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#0a0a0a]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5f1f]/10 border border-[#ff5f1f]/20">
                <Image
                  src="/icon.png"
                  alt="Basketball icon"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  DOSA
                </h1>
                <p className="text-xs text-muted-foreground">824</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Status indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono">Ethereum Mainnet</span>
              </div>

              {/* Address badge */}
              {address && (
                <div
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5f1f]/10 border border-[#ff5f1f]/20 cursor-pointer hover:bg-[#ff5f1f]/20 transition-colors"
                  onClick={() => router.push(`/user/${address}`)}
                >
                  <span className="font-mono text-xs text-[#ff5f1f]">
                    {truncateAddress(address)}
                  </span>
                </div>
              )}

              {/* Logout button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="container mx-auto px-6 border-t border-[#2a2a2a]">
          <NavTabs />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">{children}</div>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] mt-16">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono opacity-50">v1.0</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function MainSkeleton() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#0a0a0a]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5f1f]/10 border border-[#ff5f1f]/20">
                <Image
                  src="/icon.png"
                  alt="Basketball icon"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        {/* Skeleton tabs */}
        <div className="container mx-auto px-6 border-t border-[#2a2a2a] py-2.5">
          <div className="flex items-center gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-16 bg-white/5" />
            ))}
          </div>
        </div>
      </header>
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    </main>
  );
}
