"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function ProfileUpdatePage() {
  const router = useRouter();
  const { user, loading, updateProfileName } = useAuth();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    } else if (user) {
      setName(user.name);
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("নাম খালি রাখা যাবে না");
      return;
    }

    setSubmitting(true);
    const success = await updateProfileName(name.trim());
    setSubmitting(false);

    if (success) {
      router.push("/profile");
    } else {
      setError("তথ্য আপডেট করা সম্ভব হয়নি");
    }
  };

  if (loading || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-pulse">
        <div className="h-44 bg-white rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7f5] min-h-screen py-10">
      <div className="max-w-md mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>প্রোফাইলে ফিরে যান</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <h1 className="text-lg font-bold text-slate-800">তথ্য আপডেট</h1>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                নাম
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="নতুন নাম লিখুন"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0a8747] hover:bg-[#08733c] text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
