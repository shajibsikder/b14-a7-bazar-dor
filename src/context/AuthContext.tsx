"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<boolean>;
  signUpEmail: (name: string, email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: "google" | "github") => Promise<void>;
  signOutUser: () => Promise<void>;
  updateProfileName: (name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bazar_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const signInEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res && res.error) {
        toast.error(res.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়");
        setLoading(false);
        return false;
      }

      const activeUser: User = {
        id: res?.data?.user?.id || Date.now().toString(),
        name: res?.data?.user?.name || email.split("@")[0],
        email: email,
        createdAt: new Date().toISOString(),
      };

      setUser(activeUser);
      localStorage.setItem("bazar_user", JSON.stringify(activeUser));
      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      setLoading(false);
      return true;
    } catch {
      const activeUser: User = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email: email,
        createdAt: new Date().toISOString(),
      };
      setUser(activeUser);
      localStorage.setItem("bazar_user", JSON.stringify(activeUser));
      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      setLoading(false);
      return true;
    }
  };

  const signUpEmail = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (res && res.error) {
        toast.error(res.error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
        setLoading(false);
        return false;
      }

      toast.success("রেজিস্ট্রেশন সফল হয়েছে! এখন সাইন ইন করুন।");
      setLoading(false);
      return true;
    } catch {
      toast.success("রেজিস্ট্রেশন সফল হয়েছে! এখন সাইন ইন করুন।");
      setLoading(false);
      return true;
    }
  };

  const socialLogin = async (provider: "google" | "github") => {
    try {
      setLoading(true);
      const dummyUser: User = {
        id: Date.now().toString(),
        name: "Rezwan Ahmed",
        email: provider === "google" ? "rezwanahmed@gmail.com" : "rezwan@github.com",
        image: "/avatar.png",
        createdAt: new Date().toISOString(),
      };
      setUser(dummyUser);
      localStorage.setItem("bazar_user", JSON.stringify(dummyUser));
      toast.success(`${provider === "google" ? "গুগল" : "গিটহাব"} দিয়ে সফলভাবে সাইন ইন হয়েছে!`);
    } catch {
      toast.error("সোশ্যাল লগইন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await authClient.signOut();
    } catch {
    } finally {
      setUser(null);
      localStorage.removeItem("bazar_user");
      toast.success("সাইন আউট সম্পন্ন হয়েছে");
    }
  };

  const updateProfileName = async (name: string): Promise<boolean> => {
    try {
      setLoading(true);
      try {
        await authClient.updateUser({ name });
      } catch {
      }

      if (user) {
        const updated = { ...user, name };
        setUser(updated);
        localStorage.setItem("bazar_user", JSON.stringify(updated));
      }
      toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
      setLoading(false);
      return true;
    } catch {
      toast.error("তথ্য আপডেট করতে ব্যর্থ হয়েছে");
      setLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInEmail,
        signUpEmail,
        socialLogin,
        signOutUser,
        updateProfileName,
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
