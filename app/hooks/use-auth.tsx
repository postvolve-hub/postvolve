"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import type { SelectUser, InsertUser } from "@shared/schema";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "./use-toast";

type SafeUser = SelectUser;

type AuthContextType = {
  user: SafeUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SafeUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SafeUser, Error, InsertUser>;
  resetPasswordMutation: UseMutationResult<void, Error, ResetPasswordData>;
  updatePasswordMutation: UseMutationResult<void, Error, UpdatePasswordData>;
  googleLoginMutation: UseMutationResult<void, Error, void>;
};

type LoginData = Pick<InsertUser, "email" | "password">;
type ResetPasswordData = { email: string };
type UpdatePasswordData = { password: string };

export const AuthContext = createContext<AuthContextType | null>(null);

function mapSupabaseUserToSafeUser(user: any): SafeUser {
  return {
    id: user.id,
    username: user.user_metadata?.username ?? user.email?.split("@")[0] ?? "User",
    email: user.email ?? "",
    createdAt: new Date(user.created_at),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize auth state from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          if (isMounted) {
            setUser(null);
          }
        } else if (data.user && isMounted) {
          setUser(mapSupabaseUserToSafeUser(data.user));
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setUser(mapSupabaseUserToSafeUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error || !data.user) {
        throw new Error(error?.message || "Invalid email or password");
      }

      return mapSupabaseUserToSafeUser(data.user);
    },
    onSuccess: (safeUser: SafeUser) => {
      setUser(safeUser);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (newUser: InsertUser) => {
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            username: newUser.username,
          },
        },
      });

      if (error || !data.user) {
        throw new Error(error?.message || "Registration failed");
      }

      return mapSupabaseUserToSafeUser(data.user);
    },
    onSuccess: (safeUser: SafeUser) => {
      setUser(safeUser);
      toast({
        title: "Registration successful",
        description: "Account created successfully!",
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email }: ResetPasswordData) => {
      const redirectBase =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000");

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${redirectBase}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast({
        title: "Reset link sent",
        description: "Check your email for a password reset link.",
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ password }: UpdatePasswordData) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been updated. You can now sign in.",
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async () => {
      const redirectBase =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectBase}/dashboard`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Google sign-in failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        resetPasswordMutation,
        updatePasswordMutation,
        googleLoginMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export type { SafeUser };


