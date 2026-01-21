"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { useConnection, useSignMessage, useDisconnect } from "wagmi";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  address: string | null;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Stub auth provider when wallet is not configured
function AuthProviderStub({ children }: { children: ReactNode }) {
  const [state] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    address: null,
    error: "Wallet not configured",
  });

  const login = useCallback(async () => {
    // No-op
  }, []);

  const logout = useCallback(async () => {
    // No-op
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Full auth provider with wagmi integration
function AuthProviderWithWallet({ children }: { children: ReactNode }) {
  // Dynamic import to avoid issues when wagmi is not configured

  const router = useRouter();
  const { address, isConnected } = useConnection();
  // const { signMessageAsync } = useSignMessage();
  const signMessage = useSignMessage();
  const disconnect = useDisconnect();

  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    address: null,
    error: null,
  });

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/vault/stats`, {
        credentials: "include",
      });
      if (res.ok) {
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
      }));
    }
  };

  const login = useCallback(async () => {
    console.log("Starting login process");

    if (!address || !isConnected) {
      setState((prev) => ({ ...prev, error: "Wallet not connected" }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const message = `Sign in to Kobe Dashboard\nTimestamp: ${timestamp}`;

      const signature = await signMessage.mutateAsync({ message });

      const res = await fetch(`${API_BASE}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ address, signature, message }),
      });

      const data = await res.json();

      console.log("Auth response:", data);
      console.log(res);

      if (!res.ok || !data.success) {
        if (res.status === 403) {
          router.push("/unauthorized");
          return;
        }
        throw new Error(data.error || "Authentication failed");
      }

      setState({
        isAuthenticated: true,
        isLoading: false,
        address: data.data.address,
        error: null,
      });

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
      logout();
    }
  }, [address, isConnected, signMessage, router]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore errors
    }

    disconnect.mutate();
    setState({
      isAuthenticated: false,
      isLoading: false,
      address: null,
      error: null,
    });
    router.push("/");
  }, [disconnect, router]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (!projectId) {
    return <AuthProviderStub>{children}</AuthProviderStub>;
  }

  return <AuthProviderWithWallet>{children}</AuthProviderWithWallet>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
