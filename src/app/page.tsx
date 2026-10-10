import React from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await getProducts();

  const risers = [...products]
    .filter((p) => p.change && p.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = [...products]
    .filter((p) => p.change && p.change.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <div className="space-y-12 pb-20 bg-[#f4f7f5] min-h-screen">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {risers.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="text-rose-600 text-sm">▲</span>
              <span>আজ দাম বেড়েছে</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {risers.map((product) => (
                <ProductCard key={`riser-${product.id}`} product={product} />
              ))}
            </div>
          </section>
        )}

        {fallers.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="text-emerald-600 text-sm">▼</span>
              <span>আজ দাম কমেছে</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {fallers.map((product) => (
                <ProductCard key={`faller-${product.id}`} product={product} />
              ))}
            </div>
          </section>
        )}

        <section id="সব-পণ্য" className="space-y-5 scroll-mt-28">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>সব পণ্য</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={`all-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
