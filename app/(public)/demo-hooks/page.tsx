"use client";
import React, { useState } from "react";
import { useDebounced } from "@/hooks/use-debounced";
import { useOptimizedFetch } from "@/hooks/use-optimized-fetch";

export default function DemoHooksPage() {
  const [query, setQuery] = useState("");
  // Debounce the query input by 500ms
  const debouncedQuery = useDebounced(query, 500);

  // Example API endpoint (replace with your Laravel API endpoint as needed)
  const apiUrl = debouncedQuery
    ? `/api/public/search?q=${encodeURIComponent(debouncedQuery)}`
    : null;

  const { data, error, isLoading, mutate } = useOptimizedFetch<unknown[]>(apiUrl, {
    revalidateInterval: 10000, // revalidate every 10s
  });

  // Helper to safely stringify error
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
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <h1>Demo: useDebounced & useOptimizedFetch</h1>
      <label htmlFor="search">Search:</label>
      <input
        id="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
        style={{ width: "100%", padding: 8, margin: "12px 0" }}
      />
      <p>
        <strong>Debounced value:</strong> {debouncedQuery}
      </p>
      <button onClick={mutate} disabled={isLoading} style={{ marginBottom: 16 }}>
        {isLoading ? "Refreshing..." : "Manual Refresh"}
      </button>
      <div>
        {isLoading && <p>Loading...</p>}
        {typeof error !== "undefined" && error !== null && (
          <p style={{ color: "red" }}>Error: {renderError(error)}</p>
        )}
        {data && (
          <ul>
            {data.length === 0 ? (
              <li>No results found.</li>
            ) : (
              data.map((item, idx) => <li key={idx}>{JSON.stringify(item)}</li>)
            )}
          </ul>
        )}
      </div>
    </div>
  );
}