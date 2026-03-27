"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { THEMES } from "@/lib/types";
import { useState, useTransition } from "react";

export function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentTheme = searchParams.get("theme") || "";
  const currentSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams("search", searchInput);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="프로젝트 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="dark-input search-input w-full"
        />
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "#64748b" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </form>

      {/* Theme filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams("theme", "")}
          className={!currentTheme ? "btn-primary text-sm" : "chip"}
        >
          전체
        </button>
        {THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() => updateParams("theme", currentTheme === theme ? "" : theme)}
            className={currentTheme === theme ? "btn-primary text-sm" : "chip"}
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}
