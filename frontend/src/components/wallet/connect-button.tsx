"use client";
import { useRef } from "react";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useConnection, useConnectionEffect } from "wagmi";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";

interface ConnectButtonProps {
  variant?: "default" | "primary";
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export function ConnectButton({ variant = "default" }: ConnectButtonProps) {
  // If no project ID, show disabled button
  if (!projectId) {
    return (
      <Button disabled variant="outline" className="gap-2">
        <Wallet className="h-4 w-4" />
        Wallet Not Configured
      </Button>
    );
  }

  return <ConnectButtonInner variant={variant} />;
}

function ConnectButtonInner({ variant = "default" }: ConnectButtonProps) {
  const { isAuthenticated, isLoading, login, error } = useAuth();
  const connection = useConnection();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    console.log(connection.isConnected, connection.status);

    const startLogin = async () => {
      try {
        await login();
      } catch (err) {
        console.error("Login failed in ConnectButton:", err);
      }
    };

    if (
      isAuthenticated === false &&
      isLoading === false &&
      connection.isConnected === true
    ) {
      console.log("Attempting login from ConnectButton");
      startLogin();
    }
    return () => {
      hasRunRef.current = false;
    };
  }, [connection]);

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
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    variant={variant === "primary" ? "default" : "outline"}
                    className={
                      variant === "primary"
                        ? "bg-amber-500 hover:bg-amber-600 text-black font-medium gap-2"
                        : "gap-2"
                    }
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive">
                    Wrong Network
                  </Button>
                );
              }

              if (isLoading) {
                return (
                  <Button disabled variant="outline" className="gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </Button>
                );
              }

              if (error) {
                return (
                  <Button
                    onClick={login}
                    variant="outline"
                    className="gap-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Wallet className="h-4 w-4" />
                    Retry Sign In
                  </Button>
                );
              }

              return (
                <Button
                  onClick={openAccountModal}
                  variant="outline"
                  className="gap-2"
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
