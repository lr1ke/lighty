"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Entry {
  id: string;
  content: string;
  created_at: string;
  theme_id: string;
  theme_name: string;
}

const ThemeEntriesPage: React.FC = () => {
  const { themeId } = useParams();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEntries = async () => {
      if (!themeId) return;
      console.log("Fetching entries for themeId:", themeId);
      setLoading(true);
      try {
        const res = await fetch(`/api/entries/get/themes/${themeId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch entries");
        setEntries(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [themeId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Entries for Theme: {entries.length > 0 ? entries[0].theme_name : 'Unknown Theme'}</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {entries.length === 0 && !loading ? <p>No entries found for this theme.</p> : null}

      {entries.map(entry => (
        <div key={entry.id} className="p-4 bg-white shadow rounded mb-2">
          <p className="text-gray-800">{entry.content}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(entry.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ThemeEntriesPage;
