"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from '@/app/context/ThemeContext';
import { lusitana } from '@/app/ui/fonts';
import { SpeakerWaveIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
import { MoreHorizontal, ChevronUp, Clock, ChevronDown, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';



interface Entry {
  id: string;
  content: string;
  created_at: string;
  city: string;
  theme_id: string;
  
}

const CityPage: React.FC = () => {
  const { city } = useParams();
    const { themeColors, styles, theme } = useTheme();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
    const [translateTo, setTranslateTo] = useState<string | null>(null);
  const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  

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

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="relative min-h-screen">
    <div className={`max-w-2xl mx-auto  overflow-hidden ${styles.bgPrimary}`}>
      <div className="relative z-10">
      <div className={`top-0 z-20 ${styles.bgSecondary} bg-opacity-90 backdrop-blur-sm ${styles.borderColor} border-b shadow-lg`}>
          <div className="px-6 py-4 flex justify-between items-center">

            <h2 className={`text-xl font-bold flex items-center space-x-3 ${lusitana.className} ${styles.textAccent}`}>
              <span>
              Entries for City: {entries.length > 0 ? entries[0].city : 'Unknown City'}
              </span>
            </h2>
      {/* <h1 className="text-3xl font-bold mb-6">Entries for City: {entries.length > 0 ? entries[0].city : 'Unknown City'}</h1> */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {entries.length === 0 && !loading ? <p>No entries found in this city.</p> : null}

            {/* Translation options */}
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowTranslationOptions(!showTranslationOptions)}
                className={`${styles.hoverText} transition-colors`}>
                  🌍
              </button>
              <button
                className={`flex items-center space-x-2 hover:opacity-80 transition-opacity ${styles.textAccent}`}
                onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
              >
                <SpeakerWaveIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

         {showTranslationOptions && (
            <div className={`p-4 rounded-b-lg shadow-xl ${styles.textPrimary} ${styles.borderColor} border-t`}>
            <label className={`text-sm font-medium ${styles.textPrimary}`}>
              Communication Protocol:
              <select
                className={`ml-2 p-1 rounded ${styles.bgHover} ${styles.textPrimary} ${styles.borderColor} border`}
                value={translateTo || ''}
                onChange={(e) => setTranslateTo(e.target.value || null)}
              >
                  <option value="" className="bg-[#E9B44C]">Native Comm</option>
                  <option value="en" className="bg-[#E9B44C]">English</option>
                  <option value="de" className="bg-[#E9B44C]">German</option>
                  <option value="es" className="bg-[#E9B44C]">Spanish</option>
                  <option value="fr" className="bg-[#E9B44C]">French</option>
                  <option value="ru" className="bg-[#E9B44C]">Russian</option>
                  <option value="zh" className="bg-[#E9B44C]">Chinese</option>
                  <option value="hi" className="bg-[#E9B44C]">Hindi</option>
                  <option value="ar" className="bg-[#E9B44C]">Arabic</option>
                  <option value="tr" className="bg-[#E9B44C]">Turkish</option>
                  <option value="it" className="bg-[#E9B44C]">Italian</option>
                  <option value="pt" className="bg-[#E9B44C]">Portuguese</option>
                </select>
              </label>
            </div>
          )}
        </div>
        {/* Entries list */}
        <div className={`divide-y ${styles.dividerColor}`}>

      {entries.map(entry => (
        // <div key={entry.id} className="p-4 bg-white shadow rounded mb-2">
        <div 
        key={entry.id} 
        id={`entry-${entry.id}`}
        className={`p-5 transition-colors relative group ${styles.bgHover}`}
      >
                      <div className="flex space-x-3 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                  <span className={`flex items-center text-xs sm:text-sm transition-colors ${styles.textSecondary}`}>
                                        {/* themes button */}
                        {/* <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
                        <button
                          className={`flex items-center justify-center w-5 h-2 squared-full text-xs ${themeColors[entry.theme_name.trim()] || 'bg-gray-500'}`}
                          title={`View all entries for ${entry.theme_name}`}
                        >
                        </button> 
                      </Link>  */}
                      {/* Date time */}
                      <span className="ml-2">
                        {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {''}
                        {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                      </span>
                      {/* translate button */}
                      <button
                        className={`transition-opacity ml-2 hover:opacity-80 ${styles.textSecondary}`}
                        onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
                        onClick={() => readEntryContent(entry.content, translateTo)}
                      >
                        <SpeakerWaveIcon className="w-6 h-4" />
                      </button>
                    </span>
                    {/* expand button */}
                    <button 
                      onClick={() => toggleExpand(entry.id)} 
                      className={`text-sm transition-opacity hover:opacity-80 ${styles.textSecondary}`}
                      title={expandedIds.has(entry.id) ? 'show less' : 'expand text'}
                    >
                      {expandedIds.has(entry.id) ? <ChevronUp /> : <MoreHorizontal />}
                    </button>
                  </div>
                  <p className={`mt-3 whitespace-pre-wrap text-sm leading-loose ${styles.textPrimary} hover:${styles.bgHoverStatic} font-light tracking-wide`}>
                  {expandedIds.has(entry.id)
                      ? entry.content
                      : entry.content.slice(0, 280) + (entry.content.length > 280 ? '...' : '')}
                  </p>
                  <div className={`mt-3 flex justify-between items-center opacity-70 ${styles.textSecondary}`}>
                  {/* <span className="flex items-center space-x-2 transition-opacity hover:opacity-80"> */}
                    {/* threads button */}
                  {/* {entry.thread_id && (
                        <Link href={`/dashboard/groups/${entry.thread_id}`} passHref> 
                          <button 
                            className={`transition-opacity hover:opacity-80 ${styles.textSecondary}`}
                            title={entry.thread_title || ''}
                          >
                            <UserGroupIcon className="w-4 h-4" />
                          </button>
                        </Link>
                      )} {''}
                    </span> */}

                    </div>
        </div>
        </div>
        </div>
      ))}

    </div>
    </div>
    </div>
    </div>
  );
};

export default CityPage;