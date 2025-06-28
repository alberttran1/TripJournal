// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { auth, onAuthStateChanged } from "../../firebase"; // Adjust import path as needed

type StoredUser = {
  [K in keyof Required<Pick<User, "uid" | "displayName" | "email" | "photoURL">>]: NonNullable<User[K]>
};

interface AuthContextType {
  user: StoredUser | null;
  setUser: (user: StoredUser | null) => void;
  signOutUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUserState({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName ?? "",
          email: firebaseUser.email ?? "",
          photoURL: firebaseUser.photoURL ?? "",
        });
      } else {
        setUserState(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setUser = (user: StoredUser | null) => {
    setUserState(user);
  };

  const signOutUser = async () => {
    await auth.signOut();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
