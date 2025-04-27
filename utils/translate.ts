
import axios from "axios";

interface TranslationResponse {
  translatedText: string;
  sourceText: string;
  targetLanguage: string;
}

/**
 * Translates text to the specified language using the server-side API
 * @param text Text to translate
 * @param targetLanguage Target language (defaults to English)
 * @returns Translated text or null if translation failed
 */
export const translateText = async (
  text: string, 
  targetLanguage: string = 'English'
): Promise<string | null> => {
  if (!text) return null;
  
  try {
    console.log(`Translating text to ${targetLanguage}...`);
    
    const response = await axios.post<TranslationResponse>(
      '/api/tools/translate',
      {
        text,
        targetLanguage
      }
    );
    
    const translatedText = response.data.translatedText;
    console.log("Translated Text:", translatedText);
    return translatedText;
  } catch (error: any) {
    console.error("Error translating text:", 
      error.response?.data || error.message);
    return null;
  }
};

/**
 * Detects if text is likely not in English and needs translation
 * @param text Text to analyze
 * @returns Boolean indicating if translation is needed
 */
export const needsTranslation = (text: string): boolean => {
  if (!text) return false;
  
  // Simple heuristic: if more than 30% of the characters are non-ASCII,
  // it's likely not English
  const nonAsciiCount = (text.match(/[^\x00-\x7F]/g) || []).length;
  const ratio = nonAsciiCount / text.length;
  
  // Also check for specific non-English characters
  const hasNonEnglishChars = /[éèêëàâäôöòóùûüÿçñ]/i.test(text) ||  // European
                             /[\u0400-\u04FF]/i.test(text) ||       // Cyrillic
                             /[\u4E00-\u9FFF]/i.test(text) ||       // CJK
                             /[\u0600-\u06FF]/i.test(text);         // Arabic
  
  return ratio > 0.3 || hasNonEnglishChars;
};

/**
 * Auto-translates text to English if needed
 * @param text Text to potentially translate
 * @returns Original or translated text
 */
export const autoTranslate = async (text: string): Promise<string> => {
  if (!text || !needsTranslation(text)) return text;
  
  const translated = await translateText(text);
  return translated || text; // Fallback to original if translation fails
};