"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Entry {
  id: string;
  content: string;
  created_at: string;
  city: string;
  theme_id: string;
  
}

const CityPage: React.FC = () => {
  const { city } = useParams();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEntries = async () => {
      if (!city) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/entries/get/kiez/${city}`);
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
  }, [city]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Entries for City: {entries.length > 0 ? entries[0].city : 'Unknown City'}</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {entries.length === 0 && !loading ? <p>No entries found in this city.</p> : null}

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

export default CityPage;