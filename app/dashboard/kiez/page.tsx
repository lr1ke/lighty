"use client";
import React, { useEffect, useState } from "react";



interface Entry {
    id: string;
    theme_id: string;
    thread_id: string | null;
    content: string;
    city: string;
    state: string;
    location: string;
    created_at: string;
  }

const KiezPage: React.FC = () => {
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
      const res = await fetch(`/api/entries/get/kiez?limit=${limit}&offset=${offset}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch entries");


      setEntries((prev) => {
        const existingIds = new Set(prev.map(entry => entry.id));
        const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
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
    acc[entry.city] = acc[entry.city] || [];
    acc[entry.city].push(entry);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Kiez Diary</h1>
      {error && <p className="text-red-500">{error}</p>}

      {Object.keys(grouped).map((city) => (
        <div key={city} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{city}</h2>
          {grouped[city].map((entry) => (
            <div key={entry.id} className="p-4 bg-white shadow rounded mb-2">
              <p className="text-gray-800">{entry.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                {entry.state} • {new Date(entry.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ))}

      {loading && <p className="text-center mt-4">Loading more...</p>}
      {!hasMore && <p className="text-center mt-4 text-gray-500">No more entries.</p>}
    </div>
  );
};

export default KiezPage;




// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams } from 'next/navigation';




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

// const KiezPage: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [cityInfo, setCityInfo] = useState<{ name: string; state?: string; country?: string } | null>(null);   
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [offset, setOffset] = useState<number>(0);
//   const limit = 20;
//   const params = useParams();
//   const city = params?.city as string; 


//   // const fetchEntries = async () => {
//   //   if (loading || !hasMore) return;
//   //   setLoading(true);
//   //   try {
//   //     const res = await fetch(`/api/entries/get/kiez?limit=${limit}&offset=${offset}`);
//   //     const data = await res.json();
//   //     if (!res.ok) throw new Error(data.error || "Failed to fetch entries");


//   //     setEntries((prev) => {
//   //       const existingIds = new Set(prev.map(entry => entry.id));
//   //       const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
//   //       return [...prev, ...newUniqueEntries];
//   //     });
      
//   //           setHasMore(data.length === limit);
//   //     setOffset((prev) => prev + limit);
//   //   } catch (err: any) {
//   //     setError(err.message || "Unknown error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchEntries = async () => {
//     if (loading || !hasMore || !city) return;
//     setLoading(true);
//     try {
    
//       const res = await fetch(`/api/entries/get/kiez?city=${encodeURIComponent(city)}&limit=${limit}&offset=${offset}`);

//       // const res = await fetch(`/api/entries/get/kiez?city=${encodeURIComponent$city)}&limit=${limit}&offset=${offset}`);
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to fetch entries");
  
//       // Extract entries and city
//       const newEntries = data.entries || [];
//       setCityInfo(data.city || null);
  
//       setEntries((prev) => {
//         const existingIds = new Set(prev.map(entry => entry.id));
//         const uniqueNewEntries = newEntries.filter((entry: Entry) => !existingIds.has(entry.id));
//         return [...prev, ...uniqueNewEntries];
//       });
  
//       setHasMore(newEntries.length === limit); // if we received fewer than `limit`, we're at the end
//       setOffset((prev) => prev + limit);
//     } catch (err: any) {
//       setError(err.message || "Unknown error");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   useEffect(() => {
//     fetchEntries();
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop + 100 >=
//         document.documentElement.offsetHeight
//       ) {
//         fetchEntries();
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const grouped = entries.reduce<Record<string, Entry[]>>((acc, entry) => {
//     acc[entry.city] = acc[entry.city] || [];
//     acc[entry.city].push(entry);
//     return acc;
//   }, {});

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-4">Kiez Diary</h1>
//       {error && <p className="text-red-500">{error}</p>}

//       {Object.keys(grouped).map((city) => (
//         <div key={city} className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">{city}</h2>
//           {grouped[city].map((entry) => (
//             <div key={entry.id} className="p-4 bg-white shadow rounded mb-2">
//               <p className="text-gray-800">{entry.content}</p>
//               <p className="text-sm text-gray-500 mt-1">
//                 {entry.state} • {new Date(entry.created_at).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       ))}

//       {loading && <p className="text-center mt-4">Loading more...</p>}
//       {!hasMore && <p className="text-center mt-4 text-gray-500">No more entries.</p>}
//     </div>
//   );
// };

// export default KiezPage;
