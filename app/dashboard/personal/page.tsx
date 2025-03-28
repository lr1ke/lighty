
'use client'

import React, { useEffect, useState } from 'react';
import { SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
import { MoreHorizontal, Clock, MapPin, Waves } from 'lucide-react';
import toast from 'react-hot-toast';
import UnderwaterBackground from '@/app/ui/dashboard/underwater';
interface Entry {
  id: string;
  theme_id: string;
  thread_id: string | null;
  content: string;
  location: string;
  city: string;
  created_at: string;
}

const LIMIT = 50;

const PersonalComp: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [translateTo, setTranslateTo] = useState<string | null>(null);
  const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchEntries = async (currentOffset: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entries/get/personal?limit=${LIMIT}&offset=${currentOffset}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to fetch entries');
      }
      const data: Entry[] = await res.json();
      setEntries((prev) => {
        const existingIds = new Set(prev.map(entry => entry.id));
        const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
        return [...prev, ...newUniqueEntries];
      });
      if (data.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err: any) {
      const message = err.message || 'Unknown error';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries(offset);
  }, [offset]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !loading) {
        setOffset((prevOffset) => prevOffset + LIMIT);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="max-w-2xl mx-auto bg-[#0a1428] min-h-screen text-teal-200 relative overflow-hidden">

      <div className="relative z-10">
        <div className="sticky top-0 z-20 bg-[#0a2c46] bg-opacity-90 backdrop-blur-sm border-b border-teal-800/30 shadow-lg">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-teal-300 flex items-center space-x-3">
              {/* <Waves className="w-8 h-8 text-teal-500" /> */}
              <span>🌊 Monoid  Ocean<button>🐚</button></span>

            </h2>

            <div className="flex space-x-4">
              <button 
                onClick={() => setShowTranslationOptions(!showTranslationOptions)}
                className="hover:text-teal-500 transition-colors"
              >
                <GlobeAltIcon className="w-6 h-6" />
              </button>

              <button
                className="flex items-center space-x-2 hover:text-teal-400 transition-colors"
                onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
              >
                <SpeakerWaveIcon className="w-5 h-5 text-teal-300" />
              </button>
            </div>
          </div>

          {showTranslationOptions && (
            <div className="p-4 bg-[#0a3c5e] rounded-b-lg shadow-xl border-t border-teal-800/30">
              <label className="text-sm font-medium">
                Communication Protocol:
                <select
                  className="ml-2 border border-teal-700 bg-[#0a2c46] text-teal-200 p-1 rounded"
                  value={translateTo || ''}
                  onChange={(e) => setTranslateTo(e.target.value || null)}
                >
                  <option value="" className="bg-[#0a2c46]">Native Comm</option>
                  <option value="en" className="bg-[#0a2c46]"> English</option>
                  <option value="de" className="bg-[#0a2c46]"> German</option>
                  <option value="es" className="bg-[#0a2c46]"> Spanish</option>
                  <option value="fr" className="bg-[#0a2c46]"> French</option>
                  <option value="ru" className="bg-[#0a2c46]"> Russian</option>
                  <option value="zh" className="bg-[#0a2c46]"> Chinese</option>
                  <option value="hi" className="bg-[#0a2c46]"> Hindi</option>
                  <option value="ar" className="bg-[#0a2c46]"> Arabic</option>
                  <option value="tr" className="bg-[#0a2c46]"> Turkish</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 mb-4 text-red-300 bg-red-900/30 rounded-lg border border-red-700/30">
            Transmission Breach: {error}
          </div>
        )}

        <div className="divide-y divide-teal-800/30">
          {entries.map(entry => (
            <div 
              key={entry.id} 
              className="p-4 hover:bg-teal-900/20 transition-colors relative group"
            >
              <div className="absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg border-l-4 border-teal-500"></div>
              <div className="flex space-x-3 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      className="flex items-center space-x-2 hover:text-teal-400 transition-colors"
                      onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
                      onClick={() => readEntryContent(entry.content, translateTo)}
                    >
                      <SpeakerWaveIcon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" />
                    </button>
                    <MoreHorizontal className="w-5 h-5 text-teal-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <p className="mt-2 text-white whitespace-pre-wrap text-sm leading-relaxed font-mono">
                    {entry.content}
                  </p>

                  <div className="mt-3 flex justify-between items-center text-teal-400 text-opacity-70">
                    <span className="flex items-center space-x-2 hover:text-teal-300 transition-colors">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm">
                        {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </span>
                    <span className="text-xs sm:text-sm">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                    {entry.location && (
                      <span className="flex items-center space-x-1 hover:text-teal-300 transition-colors">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">{entry.city}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="p-4 text-teal-500 text-center">
              Scanning underwater data streams... Retrieving logs...
            </div>
          )}
          {!hasMore && (
            <div className="p-4 text-teal-600 text-center">
             You've reached the shore of your memories! 🌊
          </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0);
            opacity: 0.1;
          }
          50% { 
            transform: translateY(-20px);
            opacity: 0.3;
          }
        }
        body {
          background-color: #0a1428;
        }
        ::selection {
          background-color: rgba(0, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PersonalComp;


