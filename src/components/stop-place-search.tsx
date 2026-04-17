"use client"

import { useEffect, useState } from "react"
import { PlaceSearchResult } from "../lib/entur/types"

export default function StopPlaceSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        const data = await res.json();

        setResults(data.results ?? []);

      } catch { }
      setLoading(false);
    };

    const timer = setTimeout(run, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  },
    [query]);
  
  return (
    <div>
      <input
        className=""
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
      />

      {loading && <p>Searching...</p>}

      <ul className="">
        {results.map((r) => (
          <li
            key={r.id}
            onClick={() => console.log("selected", r)}
          >
            <div>{r.name}</div>
            <div>{r.label}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}