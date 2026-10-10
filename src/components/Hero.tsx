import React from "react";
import Image from "next/image";
import { toBengaliDate } from "@/lib/utils";

export default function Hero() {
  const currentDate = toBengaliDate();

  return (
    <section className="bg-white border-b border-slate-200/60 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#eaf6ee] text-[#0a8747] text-xs font-semibold">
              {currentDate}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <div className="pt-2">
              <a
                href="#সব-পণ্য"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0a8747] hover:bg-[#08733c] text-white font-semibold text-sm shadow-sm transition-all"
              >
                সব পণ্য দেখুন
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              <Image
                src="/bazar-hero.png"
                alt="বাজার দর"
                width={420}
                height={420}
                priority
                className="w-full h-auto object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
