"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
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

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || "";
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
  const router = useRouter();
  const { address, isConnected } = useConnection();
  const signMessage = useSignMessage();
  const disconnect = useDisconnect();

  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    address: null,
    error: null,
  });

  // Use a ref to prevent double-login attempts (e.g. during Strict Mode or rapid state changes)
  const authAttemptedRef = useRef(false);

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

  const login = useCallback(async () => {
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

      if (!res.ok || !data.success) {
        if (res.status === 403) {
          router.push("/unauthorized");
          return;
        }
        throw new Error(data.error || "Authentication failed");
      }

      console.log({
        isAuthenticated: true,
        isLoading: false,
        address: data.data.address,
        error: null,
      });

      setState({
        isAuthenticated: true,
        isLoading: false,
        address: data.data.address,
        error: null,
      });

      router.push("/dashboard");
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
      // Only logout on serious failures, not necessarily on user rejection
      // But we'll follow the user's original intent if they prefer
      // logout();
    }
  }, [address, isConnected, signMessage, router]);

  // Handle auto-login on connection
  useEffect(() => {
    // Reset attempt flag when disconnected so they can auto-login again if they reconnect
    if (!isConnected) {
      authAttemptedRef.current = false;
      return;
    }

    // Trigger auto-login only if connected, not authenticated, and not already attempted for this session
    if (
      isConnected &&
      address &&
      !state.isAuthenticated &&
      !state.isLoading &&
      !authAttemptedRef.current
    ) {
      authAttemptedRef.current = true;
      login().catch(() => {
        // Error handling is inside login()
      });
    }
  }, [isConnected, address, state.isAuthenticated, state.isLoading, login]);

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
