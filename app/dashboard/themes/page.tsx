"use client";
import React, { useEffect, useState } from "react";


interface Entry {
    entry_id: string;
    content: string;
    entry_created_at: string;
    thread_id: string;
    theme_id: string;
    name: string;
  }


const ThemesPage: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const limit = 20;


  const fetchEntries = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/entries/get/themes?limit=${limit}&offset=${offset}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch entries");


      setEntries((prev) => {
        const existingIds = new Set(prev.map(entry => entry.entry_id));
        const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.entry_id));
        return [...prev, ...newUniqueEntries];
      });
      setHasMore(data.length === limit);
      setOffset((prev) => prev + limit);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        fetchEntries();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const grouped = entries.reduce<Record<string, Entry[]>>((acc, entry) => {
    if (entry.theme_id) {
      acc[entry.theme_id] = acc[entry.theme_id] || [];
      acc[entry.theme_id].push(entry);
    }
    return acc;
  }, {});

  const themeMeta = (themeId: string): Entry => {
    return entries.find(e => e.theme_id === themeId)!;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Themes</h1>
      {error && <p className="text-red-500">{error}</p>}

   
{Object.keys(grouped).map((themeId) => {
        const meta = themeMeta(themeId);
        return (
          <div key={themeId} className="mb-8">
            <h2 className="text-2xl font-semibold mb-1">{meta.name}</h2>

            {grouped[themeId].map((entry) => (
              <div key={entry.entry_id} className="p-4 bg-white shadow rounded mb-2">
                <p className="text-gray-800">{entry.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(entry.entry_created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        );
      })}

      {loading && <p className="text-center mt-4">Loading more...</p>}
      {!hasMore && <p className="text-center mt-4 text-gray-500">No more entries.</p>}
    </div>
  );
};

export default ThemesPage;
