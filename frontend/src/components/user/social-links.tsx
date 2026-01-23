"use client"

import { Twitter, Mail, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialLinksProps {
  twitterUsername: string | null
  email: string | null
  solanaWallet: string | null
  className?: string
}

function truncateWallet(wallet: string): string {
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
}

export function SocialLinks({
  twitterUsername,
  email,
  solanaWallet,
  className,
}: SocialLinksProps) {
  const hasAnyLink = twitterUsername || email || solanaWallet

  if (!hasAnyLink) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3 text-sm text-muted-foreground", className)}>
      {twitterUsername && (
        <a
          href={`https://twitter.com/${twitterUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Twitter className="size-4" />
          <span>@{twitterUsername}</span>
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Mail className="size-4" />
          <span>{email}</span>
        </a>
      )}
      {solanaWallet && (
        <a
          href={`https://solscan.io/account/${solanaWallet}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors font-mono"
        >
          <Wallet className="size-4" />
          <span>{truncateWallet(solanaWallet)}</span>
        </a>
      )}
    </div>
  )
}
