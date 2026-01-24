import { Vault, Shield, BarChart3, Users } from "lucide-react";
import { ConnectButton } from "@/components/wallet/connect-button";
import Image from "next/image";

function AuroraBackground() {
  return (
    <div className="aurora-bg">
      <div className="aurora-orb aurora-orb--gold" />
      <div className="aurora-orb aurora-orb--amber" />
      <div className="aurora-glow-center" />
      <div className="aurora-mesh" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <AuroraBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20">
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
                  DOSA VC
                </h1>
                <p className="text-xs text-muted-foreground">824</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-in">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Connect your <span className="text-gold-gradient">Wallet</span>{" "}
              and Sign In
            </h2>
          </div>

          <div className="flex items-center justify-center gap-4">
            <ConnectButton variant="primary" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono opacity-50">v1.0</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
