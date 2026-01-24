"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchInterval: 30_000,
          },
        },
      }),
  );

  const config = useMemo(() => {
    if (!projectId) return null;

    const connectors = connectorsForWallets(
      [
        {
          groupName: "Recommended",
          wallets: [rainbowWallet, walletConnectWallet, metaMaskWallet],
        },
      ],
      {
        appName: "Kobe Vault",
        projectId: projectId,
        appDescription: "DOSA VC Dashboard",
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
        appIcon: `${process.env.NEXT_PUBLIC_APP_URL}/icon.png`,
      },
    );

    return createConfig({
      connectors: [...connectors],
      chains: [mainnet],
      transports: {
        [mainnet.id]: http(),
      },
      ssr: true,
    });

    // return getDefaultConfig({
    //   appName: "Kobe Vault",
    //   projectId,
    //   chains: [mainnet],
    //   ssr: false,
    //   appDescription: "DOSA VC Dashboard",
    //   appUrl: process.env.NEXT_PUBLIC_APP_URL,
    //   appIcon: `${process.env.NEXT_PUBLIC_APP_URL}/icon.png`,
    // });
  }, []);

  // If no project ID, just render children with QueryClient
  if (!config) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#22c55e",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
