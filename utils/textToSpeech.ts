// problems: the voice adds words to make text sound better, more coherent, not wanted!
// takes too long to load
// try: better separate the tranlate and read aloud functions, the tranlate button in the row under the content 
// also translate not needed in personalComp but in collab and global, also in collab and global for every entry voice switch  


import axios from "axios";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;
const audioCache = new Map<string, string>(); // Cache audio URLs by key

const ALL_VOICES = ["alloy", "nova", "echo", "fable", "onyx", "shimmer"];

export const LANGUAGES: Record<string, { name: string }> = {
  en: { name: "English" },
  de: { name: "German" },
  es: { name: "Spanish" },
  fr: { name: "French" },
  ru: { name: "Russian" },
  zh: { name: "Chinese (Mandarin)" },
  hi: { name: "Hindi" },
  ar: { name: "Arabic" },
  tr: { name: "Turkish" },
  it: { name: "Italian" },
  pt: { name: "Portuguese" },
};

const detectLanguage = (text: string): string => {
  if (/[\u4e00-\u9fff]/.test(text)) return "zh";
  if (/[А-яЁё]/i.test(text)) return "ru";
  if (/[äöüß]/i.test(text)) return "de";
  if (/[áéíóúñ]/i.test(text)) return "es";
  if (/[àâêîôûç]/i.test(text)) return "fr";
  if (/[ऀ-ॿ]/.test(text)) return "hi";
  if (/[ء-ي]/.test(text)) return "ar";
  if (/[çşğüöı]/i.test(text)) return "tr";
  if (/[àèéìòù]/i.test(text)) return "it";
  if (/[ãõç]/i.test(text)) return "pt";
  return "en";
};

const getRandomVoice = (): string => {
  return ALL_VOICES[Math.floor(Math.random() * ALL_VOICES.length)];
};

const translateText = async (text: string, targetLang: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Translate the following text into ${targetLang}. Maintain all original spacing, punctuation, and formatting. Do not modify, normalize, or correct the text in any way besides translation.`,
          },
          { role: "user", content: text },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
};

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const handleMouseEnter = debounce(async (content: string, translateTo: string | null) => {
  const cacheKey = `${content}-${translateTo}`;
  if (audioCache.has(cacheKey)) return;
  if (!content.trim()) return;

  const selectedVoice = getRandomVoice();

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/speech",
      {
        model: "tts-1-hd",
        input: content,
        voice: selectedVoice,
        response_format: "mp3",
        speed: 1.0,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const audioBlob = new Blob([response.data], { type: "audio/mp3" });
    const audioUrl = URL.createObjectURL(audioBlob);
    audioCache.set(cacheKey, audioUrl);
  } catch (error) {
    console.error("Error preloading audio:", error);
  }
}, 3000);

export const readEntryContent = async (text: string, translateTo?: string | null): Promise<void> => {
  const detectedLang = detectLanguage(text);
  const selectedVoice = getRandomVoice();

  let finalText = text;

  if (translateTo && translateTo !== detectedLang) {
    finalText = await translateText(text, translateTo);
  }

  const cacheKey = `${finalText}-${selectedVoice}`;
  if (audioCache.has(cacheKey)) {
    const cachedAudio = new Audio(audioCache.get(cacheKey)!);
    cachedAudio.play();
    return;
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/speech",
      {
        model: "tts-1-hd",
        input: finalText,
        voice: selectedVoice,
        response_format: "mp3",
        speed: 1.0,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const audioBlob = new Blob([response.data], { type: "audio/mp3" });
    const audioUrl = URL.createObjectURL(audioBlob);
    audioCache.set(cacheKey, audioUrl);

    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error: any) {
    console.error("Error generating speech:", error);
    console.error("Details:", error.response?.data
      ? new TextDecoder().decode(error.response.data)
      : error.message);
  }
};
