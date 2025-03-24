// export default function GroupPage() {
//   return <div>GroupPage</div>;
// }



'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Entry {
  entry_id: string;
  content: string;
  entry_created_at: string;
  theme_id: string;
}

interface Thread {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

const GroupPage: React.FC = () => {
  const { threadId } = useParams();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEntries = async () => {
      if (!threadId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/entries/get/groups/${threadId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch entries');
        setThread(data.thread);
        setEntries(data.entries);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [threadId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {thread ? (
        <>
          <h1 className="text-3xl font-bold mb-2">{thread.title}</h1>
          <p className="text-gray-600 mb-4">{thread.description}</p>
        </>
      ) : (
        <h1 className="text-3xl font-bold mb-4">Unknown Thread</h1>
      )}

      {entries.length === 0 && !loading ? <p>No entries found in this group.</p> : null}

      {entries.map((entry) => (
        <div key={entry.entry_id} className="p-4 bg-white shadow rounded mb-2">
          <p className="text-gray-800">{entry.content}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(entry.entry_created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

 export default GroupPage;
