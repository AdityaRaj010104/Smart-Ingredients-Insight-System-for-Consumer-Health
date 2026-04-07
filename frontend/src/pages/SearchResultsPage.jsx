import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NovaBadge from "../components/NovaBadge";
import i18n from "i18next";

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <rect width="640" height="360" fill="#eef2f7"/>
    <rect x="210" y="90" width="220" height="180" rx="16" fill="#dbe7ff"/>
    <circle cx="280" cy="160" r="24" fill="#7aa2ff"/>
    <rect x="315" y="145" width="78" height="28" rx="8" fill="#7aa2ff"/>
    <text x="320" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#5b6472">Food Image</text>
  </svg>`
)}`;

const defaultFilters = {
  minProtein: "",
  maxProtein: "",
  minFat: "",
  maxFat: "",
  minSugar: "",
  maxSugar: "",
  nova: [],
};

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(defaultFilters);

  const query = searchParams.get("q") || "";

  const fetchProducts = async (currentQuery, currentFilters) => {
    if (!currentQuery.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const lang = i18n.language.split("-")[0];
      const params = new URLSearchParams();
      params.set("q", currentQuery);
      params.set("lang", lang);
      params.set("limit", "300");

      if (currentFilters.minProtein !== "") params.set("minProtein", currentFilters.minProtein);
      if (currentFilters.maxProtein !== "") params.set("maxProtein", currentFilters.maxProtein);
      if (currentFilters.minFat !== "") params.set("minFat", currentFilters.minFat);
      if (currentFilters.maxFat !== "") params.set("maxFat", currentFilters.maxFat);
      if (currentFilters.minSugar !== "") params.set("minSugar", currentFilters.minSugar);
      if (currentFilters.maxSugar !== "") params.set("maxSugar", currentFilters.maxSugar);
      if (currentFilters.nova.length > 0) params.set("nova", currentFilters.nova.join(","));

      const res = await fetch(`http://127.0.0.1:5000/api/products/search?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Could not load products");
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQueryInput(query);
    fetchProducts(query, filters);
  }, [query, i18n.language]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProducts(query, filters);
    }, 250);

    return () => clearTimeout(debounce);
  }, [filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = queryInput.trim();
    if (!trimmed) return;
    setSearchParams({ q: trimmed });
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleNova = (group) => {
    setFilters((prev) => ({
      ...prev,
      nova: prev.nova.includes(group)
        ? prev.nova.filter((item) => item !== group)
        : [...prev.nova, group],
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const protein = toNumber(product.protein);
      const fat = toNumber(product.fat);
      const sugar = toNumber(product.sugar);
      const nova = Math.round(toNumber(product.nova_group));

      if (filters.minProtein !== "" && protein < Number(filters.minProtein)) return false;
      if (filters.maxProtein !== "" && protein > Number(filters.maxProtein)) return false;

      if (filters.minFat !== "" && fat < Number(filters.minFat)) return false;
      if (filters.maxFat !== "" && fat > Number(filters.maxFat)) return false;

      if (filters.minSugar !== "" && sugar < Number(filters.minSugar)) return false;
      if (filters.maxSugar !== "" && sugar > Number(filters.maxSugar)) return false;

      if (filters.nova.length > 0 && !filters.nova.includes(nova)) return false;

      return true;
    });
  }, [products, filters]);

  const summaryText = useMemo(() => {
    if (!query.trim()) return "Start by searching any product.";
    if (loading) return "Loading products...";
    return `Showing ${filteredProducts.length} results for \"${query}\"`;
  }, [loading, filteredProducts.length, query]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-3xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Search products"
                className="pl-9 h-10 bg-gray-50"
              />
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto p-4 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <aside className="bg-white border rounded-sm h-fit">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h2>
            <Button variant="ghost" className="h-8 px-2" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-semibold mb-2">Protein % (g/100g)</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minProtein}
                onChange={(e) => updateFilter("minProtein", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxProtein}
                onChange={(e) => updateFilter("maxProtein", e.target.value)}
              />
            </div>
          </div>

          <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-semibold mb-2">Fat % (g/100g)</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minFat}
                onChange={(e) => updateFilter("minFat", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxFat}
                onChange={(e) => updateFilter("maxFat", e.target.value)}
              />
            </div>
          </div>

          <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-semibold mb-2">Sugar % (g/100g)</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minSugar}
                onChange={(e) => updateFilter("minSugar", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxSugar}
                onChange={(e) => updateFilter("maxSugar", e.target.value)}
              />
            </div>
          </div>

          <div className="px-4 py-3">
            <h3 className="text-sm font-semibold mb-2">NOVA Group</h3>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((group) => (
                <label key={group} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters.nova.includes(group)}
                    onChange={() => toggleNova(group)}
                  />
                  <span>NOVA {group}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="bg-white border rounded-sm">
          <div className="px-4 py-3 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Product Results</h1>
            <p className="text-gray-600 text-sm mt-1">{summaryText}</p>
          </div>

          {error && <p className="px-4 py-3 text-sm text-red-600">{error}</p>}

          <div className="divide-y">
            {!loading && filteredProducts.length === 0 && query.trim() && !error && (
              <p className="px-4 py-6 text-gray-500">No products matched your filters.</p>
            )}

            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="border-0 rounded-none shadow-none hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="p-4 grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-start">
                  <div className="w-full h-32 bg-gray-50 rounded border overflow-hidden">
                    <img
                      src={product.image || FALLBACK_IMAGE}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        if (e.currentTarget.src !== FALLBACK_IMAGE) {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 leading-tight">{product.name}</h2>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                      <NovaBadge novaGroup={product.nova_group} size="sm" />
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        Protein: {Number(product.protein ?? 0).toFixed(1)}%
                      </span>
                      <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        Fat: {Number(product.fat ?? 0).toFixed(1)}%
                      </span>
                      <span className="px-2 py-1 rounded bg-pink-50 text-pink-700 border border-pink-200">
                        Sugar: {Number(product.sugar ?? 0).toFixed(1)}%
                      </span>
                      <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Calories: {Number(product.calories ?? 0).toFixed(0)} kcal
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SearchResultsPage;
