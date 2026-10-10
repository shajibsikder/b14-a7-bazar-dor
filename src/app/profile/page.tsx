"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, signOutUser, updateProfileName } = useAuth();
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    } else if (user) {
      setName(user.name);
    }
  }, [user, loading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUpdating(true);
    await updateProfileName(name.trim());
    setUpdating(false);
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/signin");
  };

  if (loading || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-28 bg-white rounded-2xl mb-6" />
        <div className="h-44 bg-white rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7f5] min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs text-slate-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
              <Image
                src={user.image || "/avatar.png"}
                alt={user.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>সাইন আউট</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800">তথ্য</h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                নাম
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0a8747] hover:bg-[#08733c] text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-50"
            >
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
