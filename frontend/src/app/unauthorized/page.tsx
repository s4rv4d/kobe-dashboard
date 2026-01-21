import Link from 'next/link'
import { ShieldX, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center space-y-6 animate-in">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <ShieldX className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground">
            Your wallet address is not on the allowlist. Only authorized
            contributors can access the dashboard.
          </p>
        </div>

        <div className="glass-card p-4 text-left space-y-2">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact the vault
            administrator to have your address added to the allowlist.
          </p>
        </div>

        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </main>
  )
}
