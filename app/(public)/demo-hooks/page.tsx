"use client";
import React, { useState } from "react";
import { useDebounced } from "@/hooks/use-debounced";
import { SWR } from "@/hooks/swrConfig";
import { Search } from "lucide-react";

export default function DemoHooksPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 500);
  const apiUrl = debouncedQuery ? `/public/search?q=${encodeURIComponent(debouncedQuery)}` : null;
  const { data, error, isLoading, mutate } = SWR<unknown[]>(apiUrl);

  function renderError(err: unknown): string {
    if (!err) return "";
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-2">
      <div className="bg-card w-full max-w-xl rounded-xl p-6 shadow-lg dark:bg-zinc-900">
        <h1 className="mb-6 text-center text-2xl font-bold">Search Demo (SWR)</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="mb-6 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border py-2 pr-10 pl-10 transition focus:ring-2 focus:outline-none"
              aria-label="Search"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted-foreground hover:text-destructive absolute top-1/2 right-3 -translate-y-1/2"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 font-semibold transition"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>
        {error && (
          <div className="bg-destructive/10 text-destructive mb-4 rounded p-3 text-sm">
            Error: {renderError(error)}
          </div>
        )}
        {isLoading && <div className="text-muted-foreground mb-4 text-center">Loading...</div>}
        {data && (
          <ul className="divide-border bg-muted divide-y overflow-hidden rounded-lg">
            {data.length === 0 ? (
              <li className="text-muted-foreground p-4 text-center">No results found.</li>
            ) : (
              data.map((item, idx) => (
                <li key={idx} className="hover:bg-accent text-foreground p-4 transition">
                  {typeof item === "string" ? item : JSON.stringify(item, null, 2)}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}