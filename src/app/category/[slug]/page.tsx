"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import { Product, Category } from "@/types";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import { toBengaliNumber } from "@/lib/utils";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Emoji from "@/components/Emoji";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<"default" | "low-to-high" | "high-to-low">("default");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [allCats, allProds] = await Promise.all([
          getCategories(),
          getProducts(slug),
        ]);

        const matchedCat = allCats.find((c) => c.slug === slug || c.id === slug);
        setCategory(matchedCat || null);

        let filtered = allProds;
        if (matchedCat) {
          filtered = allProds.filter(
            (p) => p.category === matchedCat.slug || p.category === matchedCat.id
          );
        }
        setProducts(filtered);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "low-to-high") {
      return a.today - b.today;
    }
    if (sortOption === "high-to-low") {
      return b.today - a.today;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 bg-[#f4f7f5] min-h-screen">
        <div className="h-28 bg-white rounded-2xl animate-pulse" />
        <div className="h-14 bg-white rounded-2xl animate-pulse" />
        <ProductGridSkeleton count={6} />
      </div>
    );
  }

  if (!category && products.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#f4f7f5] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-5">
          <div className="text-4xl">🔍</div>
          <h1 className="text-xl font-bold text-slate-800">
            ক্যাটাগরি পাওয়া যায়নি
          </h1>
          <p className="text-xs text-slate-500">
            আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি বিদ্যমান নেই।
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a8747] text-white text-xs font-semibold hover:bg-[#08733c]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোম পেজে ফিরে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7f5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#f2f6f4] flex items-center justify-center text-3xl shrink-0">
            <Emoji symbol={category?.icon || "🛒"} size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {category?.nameBn || "পণ্য তালিকা"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              প্রতি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 px-6 py-4 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">সাজান</span>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(
                    e.target.value as "default" | "low-to-high" | "high-to-low"
                  )
                }
                className="appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="default">ডিফল্ট</option>
                <option value="low-to-high">দাম: কম থেকে বেশি</option>
                <option value="high-to-low">দাম: বেশি থেকে কম</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 font-medium mb-4">
            মোট {toBengaliNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
