"use client";
import React, { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { sanitizeName } from "@/utils/sanitize";
import { migrateStorageKey } from "@/lib/storage-migration";

interface UserContextType {
  user: User | null;
  register: (name: string, email: string, avatar: string) => void;
  /** Updates display name and avatar; keeps the same user id and email. */
  updateProfile: (name: string, avatar: string) => void;
  clearUser: () => void;
  isRegistered: boolean;
  /** True after localStorage has been read on the client (avoids registration flash). */
  isAuthReady: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "anonyzap:user";
const LEGACY_STORAGE_KEY = "chat-anywhere:user";

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  migrateStorageKey(STORAGE_KEY, LEGACY_STORAGE_KEY);

  const [user, setUser, removeUser, isAuthReady] = useLocalStorage<User | null>(
    STORAGE_KEY,
    null
  );

  const register = useCallback(
    (name: string, email: string, avatar: string) => {
      const newUser: User = {
        id: uuidv4(),
        name,
        email,
        avatar,
        joinedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    },
    [setUser]
  );

  const updateProfile = useCallback(
    (name: string, avatar: string) => {
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: sanitizeName(name),
          avatar,
        };
      });
    },
    [setUser]
  );

  const clearUser = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    removeUser();
  }, [removeUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        register,
        updateProfile,
        clearUser,
        isRegistered: user !== null,
        isAuthReady,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
