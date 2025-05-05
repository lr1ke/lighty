'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { SpeakerWaveIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';

import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
import { MoreHorizontal, ChevronUp, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeContext';
import { lusitana } from '@/app/ui/fonts';
import { translateBatch } from '@/utils/translate';

// Define language mapping for clearer code
const LANGUAGE_MAP = {
  'en': 'English',
  'de': 'German',
  'es': 'Spanish',
  'fr': 'French',
  'ru': 'Russian',
  'zh': 'Chinese',
  'hi': 'Hindi',
  'ar': 'Arabic',
  'tr': 'Turkish',
  'it': 'Italian',
  'pt': 'Portuguese'
};

interface Entry {
  id: string;
  theme_id: string;
  theme_name: string;
  thread_id: string | null;
  thread_title: string | null;
  content: string;
  location: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
}

const LIMIT = 50;

const GlobalComp: React.FC = () => {
  const { themeColors, styles, theme } = useTheme();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [translateTo, setTranslateTo] = useState<string | null>(null);
  const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isTranslating, setIsTranslating] = useState(false);
  // Store translated content separately to avoid modifying original entries
  const [translatedContent, setTranslatedContent] = useState<Record<string, string>>({});
  
  const fetchEntries = async (currentOffset: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entries/get/global?limit=${LIMIT}&offset=${currentOffset}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to fetch entries');
      }
      const data: Entry[] = await res.json();
      
      // Update entries state with new unique entries
      setEntries((prev) => {
        const existingIds = new Set(prev.map(entry => entry.id));
        const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
        return [...prev, ...newUniqueEntries];
      });
      
      // Auto-translate new entries if a language is selected
      if (translateTo && data.length > 0) {
        translateNewEntries(data);
      }
      
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

  // Function to translate only new entries
  const translateNewEntries = async (newEntries: Entry[]) => {
    if (!translateTo || newEntries.length === 0) return;
    
    try {
      // Only translate entries we don't already have translations for
      const entriesToTranslate = newEntries.filter(entry => !translatedContent[entry.id]);
      
      if (entriesToTranslate.length === 0) return;
      
      const textsToTranslate = entriesToTranslate.map(entry => entry.content);
      const targetLanguage = LANGUAGE_MAP[translateTo as keyof typeof LANGUAGE_MAP] || translateTo;
      
      // Show subtle toast for background translation
      toast.loading(`Translating ${entriesToTranslate.length} new entries...`, { id: 'translate-new' });
      
      // Use batch translation
      const translatedTexts = await translateBatch(textsToTranslate, targetLanguage);
      
      if (translatedTexts) {
        // Update our translation map
        const newTranslations = { ...translatedContent };
        entriesToTranslate.forEach((entry, index) => {
          newTranslations[entry.id] = translatedTexts[index] || entry.content;
        });
        
        setTranslatedContent(newTranslations);
        toast.success(`Translated ${entriesToTranslate.length} new entries`, { id: 'translate-new' });
      }
    } catch (error) {
      console.error("Error translating new entries:", error);
      toast.error("Couldn't translate new entries", { id: 'translate-new' });
    }
  };

  // Handle translating all visible entries at once
  const handleTranslateAll = async () => {
    if (!entries.length || !translateTo) {
      toast.error('No entries to translate or no language selected');
      return;
    }
    
    setIsTranslating(true);
    toast.loading('Translating all entries...', { id: 'translate-all' });

    try {
      // Get entries we don't already have translations for
      const entriesToTranslate = entries.filter(entry => !translatedContent[entry.id]);
      
      const targetLanguage = LANGUAGE_MAP[translateTo as keyof typeof LANGUAGE_MAP] || translateTo;
      
      // Translate in batches to avoid overwhelming the API
      const batchSize = 20;
      let allTranslated = { ...translatedContent };
      
      for (let i = 0; i < entriesToTranslate.length; i += batchSize) {
        const batchEntries = entriesToTranslate.slice(i, i + batchSize);
        const batchTexts = batchEntries.map(entry => entry.content);
        
        // Update progress toast
        toast.loading(`Translating batch ${Math.ceil((i+1)/batchSize)} of ${Math.ceil(entriesToTranslate.length/batchSize)}...`, { id: 'translate-all' });
        
        const translatedBatch = await translateBatch(batchTexts, targetLanguage);
        
        if (translatedBatch) {
          // Update our translation map with this batch
          batchEntries.forEach((entry, idx) => {
            allTranslated[entry.id] = translatedBatch[idx] || entry.content;
          });
        }
      }
      
      setTranslatedContent(allTranslated);
      toast.success(`Translated all entries to ${targetLanguage}`, { id: 'translate-all' });
    } catch (error) {
      console.error('Error translating entries:', error);
      toast.error('Translation service error', { id: 'translate-all' });
    } finally {
      setIsTranslating(false);
    }
  };

  // Reset translations when language changes
  useEffect(() => {
    setTranslatedContent({});
    if (translateTo && entries.length > 0) {
      handleTranslateAll();
    }
  }, [translateTo]);

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

  // Helper to get the content for an entry (translated or original)
  const getEntryContent = (entry: Entry) => {
    return translatedContent[entry.id] || entry.content;
  };

  return (
    <div className="relative min-h-screen">
      <div className={`max-w-2xl mx-auto overflow-hidden ${styles.bgPrimary}`}>
        <div className="relative z-10">
          <div className={`top-0 z-20 ${styles.bgSecondary} bg-opacity-90 backdrop-blur-sm ${styles.borderColor} border-b shadow-lg`}>
            <div className="px-6 py-4 flex justify-between items-center">
              <h2 className={`text-xl font-bold flex items-center space-x-3 ${lusitana.className} ${styles.textAccent}`}>
                <span>{styles.icon} Groupoid</span>
              </h2>
              
              {/* Translation controls */}
              <div className="flex space-x-4">
                <button 
                  onClick={() => {
                    // If options are shown and language is selected, translate
                    if (showTranslationOptions && translateTo) {
                      handleTranslateAll();
                    } else {
                      // Otherwise toggle options
                      setShowTranslationOptions(!showTranslationOptions);
                    }
                  }}
                  disabled={isTranslating}
                  className={`${styles.hoverText} transition-colors ${isTranslating ? 'opacity-50' : ''}`}
                  title={showTranslationOptions && translateTo ? `Translate all to ${translateTo}` : 'Show translation options'}
                >
                  {isTranslating ? '⏳' : '🌍'}
                </button>
                
                <button
                  className={`flex items-center space-x-2 hover:opacity-80 transition-opacity ${styles.textAccent}`}
                  onClick={() => {
                    // Use translated content if available
                    const textsToRead = entries.map(e => getEntryContent(e)).join('. ');
                    readEntryContent(textsToRead, null); // No need to translate again
                  }}
                >
                  <SpeakerWaveIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showTranslationOptions && (
              <div className={`p-4 rounded-b-lg shadow-xl ${styles.textPrimary} ${styles.borderColor} border-t`}>
                <div className="flex justify-between items-center">
                  <label className={`text-sm font-medium ${styles.textPrimary}`}>
                    Communication Protocol:
                    <select
                      className={`ml-2 p-1 rounded ${styles.bgHover} ${styles.textPrimary} ${styles.borderColor} border`}
                      value={translateTo || ''}
                      onChange={(e) => setTranslateTo(e.target.value || null)}
                      disabled={isTranslating}
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
                  
                  {/* Reset translations button */}
                  {Object.keys(translatedContent).length > 0 && (
                    <button
                      onClick={() => {
                        setTranslatedContent({});
                        toast.success('Returned to original language');
                      }}
                      className={`text-sm px-2 py-1 ${styles.textAccent} hover:opacity-80`}
                      disabled={isTranslating}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className={`p-4 mb-4 rounded-lg ${styles.bgSecondary} ${styles.textAccent} ${styles.borderColor} border`}>
              Transmission Breach: {error}
            </div>
          )}
          
          {/* Entries list */}
          <div className={`divide-y ${styles.dividerColor}`}>
            {entries.map(entry => (
              <div 
                key={entry.id} 
                id={`entry-${entry.id}`}
                className={`p-5 transition-colors relative group ${styles.bgHover}`}
              >
                {/* Entry header and content - same as before */}
                <div className="flex space-x-3 relative z-10">
                  <div className="flex-1 min-w-0">


                  <div className="flex items-center justify-between mb-2">
                  <span className={`flex items-center text-xs sm:text-sm transition-colors ${styles.textSecondary}`}>
                                        {/* themes button */}
                  <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
                        <button
                          className={`flex items-center justify-center w-5 h-2 squared-full text-xs ${themeColors[entry.theme_name.trim()] || 'bg-gray-500'}`}
                          title={`View all entries for ${entry.theme_name}`}
                        >
                        </button> 
                      </Link> 
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
                    {/* text */}

                  <p className={`mt-3 whitespace-pre-wrap text-sm leading-loose ${styles.textPrimary} hover:${styles.bgHoverStatic} font-light tracking-wide`}>
                      {expandedIds.has(entry.id)
                        ? getEntryContent(entry)
                        : getEntryContent(entry).slice(0, 280) + (entry.content.length > 280 ? '...' : '')}
                    </p> 

                  <div className={`mt-3 flex justify-between items-center opacity-70 ${styles.textSecondary}`}>
                  <span className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                    {/* threads button */}
                  {entry.thread_id && (
                        <Link href={`/dashboard/groups/${entry.thread_id}`} passHref> 
                          <button 
                            className={`transition-opacity hover:opacity-80 ${styles.textSecondary}`}
                            title={entry.thread_title || ''}
                          >
                            <UserGroupIcon className="w-4 h-4" />
                          </button>
                        </Link>
                      )} {''}
                    </span>

                    {entry.city && ( 
                      <Link href={`/dashboard/kiez/${encodeURIComponent(entry.city)}`}>
                      <button 
                          title={`View all entries for ${entry.city}`}
                          className="flex items-center space-x-1 transition-opacity hover:opacity-80"
                        >
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs">{entry.city}</span>
                        </button>                 
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

            
            {loading && (
              <div className={`p-4 text-center ${styles.textAccent}`}>
                {styles.loadingText}
              </div>
            )}
            
            {!hasMore && (
              <div className={`p-4 text-center ${styles.textSecondary}`}>
                {styles.endText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalComp;






