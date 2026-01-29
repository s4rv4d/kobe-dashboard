"use client";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";

interface ConnectButtonProps {
  variant?: "default" | "primary" | "pill";
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export function ConnectButton({ variant = "default" }: ConnectButtonProps) {
  if (!projectId) {
    if (variant === "pill") {
      return (
        <button disabled className="connect-pill">
          Wallet Not Configured
        </button>
      );
    }
    return (
      <Button disabled variant="outline" className="gap-2 rounded-full">
        <Wallet className="h-4 w-4" />
        Wallet Not Configured
      </Button>
    );
  }

  return <ConnectButtonInner variant={variant} />;
}

function ConnectButtonInner({ variant = "default" }: ConnectButtonProps) {
  const { isLoading, login, error } = useAuth();

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none" as const,
                userSelect: "none" as const,
              },
            })}
          >
            {(() => {
              if (!connected) {
                if (variant === "pill") {
                  return (
                    <button onClick={openConnectModal} className="connect-pill">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <rect x="1" y="1" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Connect Wallet
                    </button>
                  );
                }
                return (
                  <Button
                    onClick={openConnectModal}
                    variant={variant === "primary" ? "default" : "outline"}
                    className={
                      variant === "primary"
                        ? "bg-[#ff5f1f] hover:bg-[#ff5f1f]/90 text-white font-medium gap-2 rounded-full"
                        : "gap-2 rounded-full"
                    }
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                if (variant === "pill") {
                  return (
                    <button
                      onClick={openChainModal}
                      className="connect-pill !bg-red-500 !text-white"
                    >
                      Wrong Network
                    </button>
                  );
                }
                return (
                  <Button
                    onClick={openChainModal}
                    variant="destructive"
                    className="rounded-full"
                  >
                    Wrong Network
                  </Button>
                );
              }

              if (isLoading) {
                if (variant === "pill") {
                  return (
                    <button disabled className="connect-pill">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing in...
                    </button>
                  );
                }
                return (
                  <Button
                    disabled
                    variant="outline"
                    className="gap-2 rounded-full"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </Button>
                );
              }

              if (error) {
                if (variant === "pill") {
                  return (
                    <button
                      onClick={login}
                      className="connect-pill !bg-red-100 !text-red-600"
                    >
                      Retry Sign In
                    </button>
                  );
                }
                return (
                  <Button
                    onClick={login}
                    variant="outline"
                    className="gap-2 rounded-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Wallet className="h-4 w-4" />
                    Retry Sign In
                  </Button>
                );
              }

              if (variant === "pill") {
                return (
                  <button onClick={openAccountModal} className="connect-pill">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    {account.displayName}
                  </button>
                );
              }

              return (
                <Button
                  onClick={openAccountModal}
                  variant="outline"
                  className="gap-2 rounded-full"
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-mono text-sm">
                    {account.displayName}
                  </span>
                </Button>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
