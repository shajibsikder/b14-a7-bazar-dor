import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { toBengaliNumber, formatUnit } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between"
    >
      <div className="flex items-center gap-3.5 mb-5">
        <div className="w-12 h-12 rounded-full bg-[#f2f6f4] flex items-center justify-center text-2xl shrink-0">
          {product.image || "📦"}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-800 text-base group-hover:text-emerald-700 transition-colors truncate">
            {product.nameBn}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {formatUnit(product.unit)}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between pt-2">
        <div>
          <span className="text-[11px] text-slate-400 block mb-0.5">
            আজকের দাম
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-900">
              {toBengaliNumber(product.today)}
            </span>
            <span className="text-xs font-semibold text-slate-600">টাকা</span>
          </div>
        </div>

        <div
          className={`text-xs font-semibold ${
            isUp
              ? "text-rose-600"
              : isDown
              ? "text-emerald-600"
              : "text-slate-500"
          }`}
        >
          {isUp ? "▲ " : isDown ? "▼ " : "— "}
          {toBengaliNumber(product.change.pct)}%
        </div>
      </div>
    </Link>
  );
}
