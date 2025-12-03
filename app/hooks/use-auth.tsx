"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import {
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import type { SelectUser, InsertUser } from "@shared/schema";
import { useToast } from "./use-toast";

type SafeUser = Omit<SelectUser, "password">;

type AuthContextType = {
  user: SafeUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SafeUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SafeUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  // TODO: Replace with Supabase auth implementation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      // Mock implementation - will be replaced with Supabase
      return new Promise<SafeUser>((resolve, reject) => {
        setTimeout(() => {
          // For now, just create a mock user
          const mockUser: SafeUser = {
            id: "mock-id",
            username: credentials.username,
            email: `${credentials.username}@example.com`,
            createdAt: new Date(),
          };
          resolve(mockUser);
        }, 500);
      });
    },
    onSuccess: (user: SafeUser) => {
      setUser(user);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (newUser: InsertUser) => {
      // Mock implementation - will be replaced with Supabase
      return new Promise<SafeUser>((resolve, reject) => {
        setTimeout(() => {
          const mockUser: SafeUser = {
            id: "mock-id",
            username: newUser.username,
            email: newUser.email,
            createdAt: new Date(),
          };
          resolve(mockUser);
        }, 500);
      });
    },
    onSuccess: (user: SafeUser) => {
      setUser(user);
      toast({
        title: "Registration successful",
        description: "Account created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Mock implementation - will be replaced with Supabase
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    },
    onSuccess: () => {
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
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

