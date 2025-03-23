"use client";
import React, { useEffect, useState } from "react";


interface Entry {
    entry_id: string;
    content: string;
    entry_created_at: string;
    thread_id: string;
    title: string;
    description: string;
    thread_created_at: string;
}


// interface Entry {
//     id: string;
//     theme_id: string;
//     thread_id: string | null;
//     content: string;
//     city: string;
//     state: string;
//     location: string;
//     created_at: string;
//   }

const GroupsPage: React.FC = () => {
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
      const res = await fetch(`/api/entries/get/groups?limit=${limit}&offset=${offset}`);
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
    if (entry.thread_id) {
      acc[entry.thread_id] = acc[entry.thread_id] || [];
      acc[entry.thread_id].push(entry);
    }
    return acc;
  }, {});

  const threadMeta = (threadId: string): Entry => {
    return entries.find(e => e.thread_id === threadId)!;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Groups (gated access)</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* {Object.keys(grouped).map((thread_id) => (
        <div key={thread_id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{thread_id}</h2>
          {grouped[thread_id].map((entry) => (
            <div key={thread_id} className="p-4 bg-white shadow rounded mb-2">
              <p className="text-gray-800">{entry.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                {entry.state} • {new Date(entry.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ))} */}

{Object.keys(grouped).map((threadId) => {
        const meta = threadMeta(threadId);
        return (
          <div key={threadId} className="mb-8">
            <h2 className="text-2xl font-semibold mb-1">{meta.title}</h2>
            <p className="text-gray-600 mb-3">{meta.description}</p>

            {grouped[threadId].map((entry) => (
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

export default GroupsPage;
