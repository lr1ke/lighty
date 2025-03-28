import axios from "axios";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;

interface ChatCompletionResponse {
  choices: { message: { content: string } }[];
}

export const translateText = async (text: string): Promise<string | null> => {
  try {
    console.log("Translating text...");

    const response = await axios.post<ChatCompletionResponse>(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Translate the following text into English:",
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

    const translatedText = response.data.choices[0].message.content.trim();
    console.log("Translated Text:", translatedText);
    return translatedText;
  } catch (error: any) {
    console.error("Error translating text:", error.response?.data || error.message);
    return null;
  }
};
