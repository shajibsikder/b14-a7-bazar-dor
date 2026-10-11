"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProductByIdOrSlug } from "@/lib/api";
import { Product } from "@/types";
import { toBengaliNumber, formatUnit } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Emoji from "@/components/Emoji";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { user, loading: authLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("পণ্যটির বিস্তারিত দেখতে দয়া করে সাইন ইন করুন");
      router.push(`/signin?redirect=/product/${slug}`);
    }
  }, [user, authLoading, router, slug]);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const found = await getProductByIdOrSlug(slug);
        setProduct(found);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (authLoading || (loading && !product)) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6 bg-[#f4f7f5] min-h-screen">
        <div className="h-6 w-48 bg-white rounded animate-pulse" />
        <div className="h-40 bg-white rounded-2xl animate-pulse" />
        <div className="h-60 bg-white rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#f4f7f5] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800">লগইন প্রয়োজন</h2>
          <p className="text-xs text-slate-500">
            এই পেজটি দেখার জন্য আপনাকে অবশ্যই সাইন ইন করতে হবে।
          </p>
          <Link
            href={`/signin?redirect=/product/${slug}`}
            className="inline-block px-5 py-2.5 bg-[#0a8747] text-white rounded-xl text-xs font-semibold hover:bg-[#08733c]"
          >
            সাইন ইন পেজে যান
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#f4f7f5] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-4">
          <div className="text-4xl">📦</div>
          <h2 className="text-xl font-bold text-slate-800">পণ্য পাওয়া যায়নি</h2>
          <p className="text-xs text-slate-500">
            আপনার অনুরোধকৃত পণ্যের তথ্য পাওয়া যায়নি।
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-[#0a8747] text-white rounded-xl text-xs font-semibold hover:bg-[#08733c]"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const markets = product.markets || [];

  let lowestMarket = markets[0];
  let highestMarket = markets[0];

  markets.forEach((m) => {
    if (lowestMarket && m.min < lowestMarket.min) lowestMarket = m;
    if (highestMarket && m.max > highestMarket.max) highestMarket = m;
  });

  const minPrice = lowestMarket ? lowestMarket.min : product.today;
  const maxPrice = highestMarket ? highestMarket.max : product.today;
  const avgPrice =
    markets.length > 0
      ? Math.round(
          markets.reduce((acc, m) => acc + (m.min + m.max) / 2, 0) / markets.length
        )
      : product.today;

  const diff = Math.abs(product.today - (product.yesterday || product.today));
  const diffText =
    product.change.dir === "up"
      ? `গতকালকের তুলনায় আজ দাম বেড়েছে ${toBengaliNumber(diff)} টাকা`
      : product.change.dir === "down"
      ? `গতকালকের তুলনায় আজ দাম কমেছে ${toBengaliNumber(diff)} টাকা`
      : "গতকালকের তুলনায় আজ দাম অপরিবর্তিত";

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <div className="bg-[#f4f7f5] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-800">
            হোম
          </Link>
          <span>&gt;</span>
          <Link
            href={`/category/${product.category}`}
            className="hover:text-slate-800"
          >
            {product.categoryNameBn || "ক্যাটাগরি"}
          </Link>
          <span>&gt;</span>
          <span className="text-slate-800 font-medium">{product.nameBn}</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f2f6f4] flex items-center justify-center text-4xl shrink-0">
              <Emoji symbol={product.image || "📦"} size={44} />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                {product.nameBn}
              </h1>
              <p className="text-xs text-slate-500">
                {formatUnit(product.unit)} - {product.categoryNameBn || "চাল"}
              </p>
              <p className="text-xs text-slate-400">{diffText}</p>
            </div>
          </div>

          <div className="bg-[#f8faf9] rounded-2xl p-4 border border-slate-100 text-center sm:text-right min-w-[170px] w-full sm:w-auto">
            <span className="text-[11px] text-slate-400 block">আজকের দাম</span>
            <div className="text-3xl font-black text-slate-900 my-0.5">
              {toBengaliNumber(product.today)}
            </div>
            <span className="text-xs text-slate-500 block mb-1.5">
              টাকা / {formatUnit(product.unit).replace("প্রতি ", "")}
            </span>
            <div
              className={`text-xs font-semibold inline-block ${
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
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#f8faf9] rounded-xl p-4 border border-slate-100">
              <span className="text-xs text-slate-500 block">সর্বনিম্ন দাম</span>
              <div className="text-xl font-bold text-emerald-600 my-1">
                {toBengaliNumber(minPrice)} টাকা
              </div>
              <span className="text-[11px] text-slate-400 block truncate">
                সবচেয়ে কম: {lowestMarket ? lowestMarket.market : "বাজার"}
              </span>
            </div>

            <div className="bg-[#f8faf9] rounded-xl p-4 border border-slate-100">
              <span className="text-xs text-slate-500 block">সর্বাধিক দাম</span>
              <div className="text-xl font-bold text-rose-600 my-1">
                {toBengaliNumber(maxPrice)} টাকা
              </div>
              <span className="text-[11px] text-slate-400 block truncate">
                সবচেয়ে বেশি: {highestMarket ? highestMarket.market : "বাজার"}
              </span>
            </div>

            <div className="bg-[#f8faf9] rounded-xl p-4 border border-slate-100">
              <span className="text-xs text-slate-500 block">গড় দাম</span>
              <div className="text-xl font-bold text-emerald-600 my-1">
                {toBengaliNumber(avgPrice)} টাকা
              </div>
              <span className="text-[11px] text-slate-400 block">
                {formatUnit(product.unit)}-এর হিসাবে
              </span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-800">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-[#f8faf9] font-semibold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">বাজার</th>
                    <th className="py-3 px-4">বিভাগ</th>
                    <th className="py-3 px-4 text-center">সর্বনিম্ন</th>
                    <th className="py-3 px-4 text-center">সর্বাধিক</th>
                    <th className="py-3 px-4 text-right">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {markets.map((m, idx) => (
                    <tr key={`${m.market}-${idx}`} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {m.market}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{m.division}</td>
                      <td className="py-3 px-4 text-center text-slate-700">
                        {toBengaliNumber(m.min)} টাকা
                      </td>
                      <td className="py-3 px-4 text-center text-slate-700">
                        {toBengaliNumber(m.max)} টাকা
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {toBengaliNumber(
                          ((m.min + m.max) / 2).toFixed(2).replace(/\.00$/, "")
                        )}{" "}
                        টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
