import { Vault, Shield, BarChart3, Users } from 'lucide-react'
import { ConnectButton } from '@/components/wallet/connect-button'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20">
                <Vault className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Kobe</h1>
                <p className="text-xs text-muted-foreground">Vault Dashboard</p>
              </div>
            </div>

            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-in">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Track Your{' '}
              <span className="text-gold-gradient">Gnosis Safe</span>{' '}
              Performance
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Monitor vault stats, XIRR returns, and contributor equity in
              real-time. Connect your wallet to access the dashboard.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <ConnectButton variant="primary" />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
            <FeatureCard
              icon={BarChart3}
              title="Portfolio Tracking"
              description="Real-time vault value and investment multiples"
            />
            <FeatureCard
              icon={Shield}
              title="Secure Access"
              description="Wallet-based authentication for allowlisted members"
            />
            <FeatureCard
              icon={Users}
              title="Contributor Stats"
              description="Track equity distribution and individual returns"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">Gnosis Safe Integration</span>
            <span className="font-mono opacity-50">v1.0</span>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="glass-card p-6 text-left">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 mb-4">
        <Icon className="h-5 w-5 text-amber-400" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
