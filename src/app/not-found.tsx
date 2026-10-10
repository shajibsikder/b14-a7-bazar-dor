import React from "react";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 text-center shadow-sm space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-sm">
          <SearchX className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-slate-800 block">৪০৪</span>
          <h1 className="text-xl font-bold text-slate-800">
            পেজটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-sm text-slate-500">
            আপনি যে পেজটিতে যাওয়ার চেষ্টা করছেন তা হয়তো সরানো হয়েছে বা লিংকটি সঠিক নয়।
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোম পেজে ফিরে যান</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
