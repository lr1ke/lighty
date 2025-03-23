'use client'

import React, { useEffect, useState } from 'react';
import { SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
import { MoreHorizontal, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Entry {
  id: string;
  theme_id: string;
  theme_name: string;
  thread_id: string | null;
  content: string;
  location: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
}

const themeColors: Record<string, string> = {
    morning: 'bg-yellow-300',
    evening: 'bg-blue-300',
    weekly: 'bg-red-300',
    kiez: 'bg-purple-300',
    revelation: 'bg-pink-300',
    story: 'bg-orange-300',
  };  

const LIMIT = 50;

const PersonalComp: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [translateTo, setTranslateTo] = useState<string | null>(null);
  const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());




  const fetchEntries = async (currentOffset: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entries/get/global?limit=${LIMIT}&offset=${currentOffset}`);
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

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">Global</h2>

          <div className="flex space-x-4">
            <button onClick={() => setShowTranslationOptions(!showTranslationOptions)}>
              <GlobeAltIcon className="w-6 h-6 hover:text-blue-500" />
            </button>

            <button
              className="flex items-center space-x-2 hover:text-red-500"
              onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
            >
              <SpeakerWaveIcon className="w-5 h-5 text-blue-300" />
              <span>Read All</span>
            </button>
          </div>
        </div>

        {showTranslationOptions && (
          <div className="p-4 bg-gray-100 rounded shadow-md">
            <label>
              <span className="text-sm font-medium">Translate To:</span>
              <select
                className="ml-2 border p-1 rounded"
                value={translateTo || ''}
                onChange={(e) => setTranslateTo(e.target.value || null)}
              >
                <option value="">None</option>
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="ru">Russian</option>
                <option value="zh">Chinese</option>
                <option value="hi">Hindi</option>
                <option value="ar">Arabic</option>
                <option value="tr">Turkish</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {entries.map(entry => (
          <div key={entry.id} className="p-4 hover:bg-blue-50 transition-colors">
            <div className="flex space-x-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">

                <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
                  <button
                        className={`w-4 h-4 rounded-full ${themeColors[entry.theme_name] || 'bg-gray-300'}`}
                        title={`View all entries for ${entry.theme_name}`}
                    />
                  </Link>

                  <button onClick={() => toggleExpand(entry.id)} className="text-blue-500 text-sm mt-1">
                    {expandedIds.has(entry.id) ? '<' : '...'}
                  </button>
                </div>

                <p className="mt-2 text-gray-900 whitespace-pre-wrap">
                    {expandedIds.has(entry.id)
                    ? entry.content
                    : entry.content.slice(0, 280) + (entry.content.length > 280 ? '...' : '')}
                </p>

                <div className="mt-3 flex justify-between items-center text-gray-500">

                <button
                    className="flex items-center space-x-2 hover:text-red-500"
                    onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
                    onClick={() => readEntryContent(entry.content, translateTo)}
                  >
                    <SpeakerWaveIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <span className="flex items-center space-x-2 hover:text-blue-500" title={new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}>
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <span className="text-xs sm:text-sm">{new Date(entry.created_at).toLocaleDateString()}</span>
                  


                  {entry.city && (
                  <Link href={`/dashboard/kiez/${entry.city}`} passHref>
                    <button title={`View all entries for ${entry.city}`}>
                      <span className="flex items-center space-x-1 hover:text-blue-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">{entry.city}</span>
                      </span>   
                    </button>                 
                  </Link>
                  )}

      
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="p-4 text-gray-500">Loading more entries...</div>}
        {!hasMore && <div className="p-4 text-gray-500 text-center">You've reached the end.</div>}
      </div>
    </div>
  );
};

export default PersonalComp;
