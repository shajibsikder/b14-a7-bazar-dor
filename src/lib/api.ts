import { Category, Product } from "@/types";

const BASE_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
];

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  let lastError: unknown = null;

  for (const base of BASE_URLS) {
    try {
      const res = await fetch(`${base}${endpoint}`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) {
        continue;
      }
      const data = await res.json();
      if (data && !data.error) {
        return data as T;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to fetch data from API");
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchFromApi<Category[]>("/categories");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const endpoint = category ? `/products?category=${category}` : "/products";
    const data = await fetchFromApi<Product[]>(endpoint);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  try {
    const allProducts = await getProducts();
    const matched = allProducts.find(
      (p) => p.slug === idOrSlug || p.id.toString() === idOrSlug
    );
    if (matched) return matched;

    if (!isNaN(Number(idOrSlug))) {
      const single = await fetchFromApi<Product>(`/products/${idOrSlug}`);
      if (single && single.nameBn) return single;
    }
    return null;
  } catch {
    return null;
  }
}
