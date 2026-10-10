"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types";
import { toBengaliNumber, formatUnit } from "@/lib/utils";
import Link from "next/link";

interface PriceTickerProps {
  products: Product[];
}

export default function PriceTicker({ products }: PriceTickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !products || products.length === 0) {
    return null;
  }

  const tickerItems = [...products, ...products];

  return (
    <div className="bg-[#f8faf9] text-slate-700 border-b border-slate-200/80 text-xs py-2 overflow-hidden select-none">
      <div className="flex animate-marquee items-center gap-6 whitespace-nowrap">
        {tickerItems.map((p, idx) => {
          const isUp = p.change.dir === "up";
          const isDown = p.change.dir === "down";

          return (
            <Link
              key={`${p.id}-${idx}`}
              href={`/product/${p.slug || p.id}`}
              className="inline-flex items-center gap-1.5 px-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-sm">{p.image || "📦"}</span>
              <span className="font-medium text-slate-800">{p.nameBn}</span>
              <span className="text-slate-600">
                {toBengaliNumber(p.today)} টাকা/{formatUnit(p.unit).replace("প্রতি ", "")}
              </span>
              <span
                className={`font-semibold ${
                  isUp
                    ? "text-rose-600"
                    : isDown
                    ? "text-emerald-600"
                    : "text-slate-500"
                }`}
              >
                {isUp ? "▲ " : isDown ? "▼ " : "— "}
                {toBengaliNumber(p.change.pct)}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
