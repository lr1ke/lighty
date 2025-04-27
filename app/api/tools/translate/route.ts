import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = await req.json();
    
    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Translate the following text into ${targetLang}. Maintain all original spacing, punctuation, and formatting.`,
        },
        { role: "user", content: text },
      ],
    });

    const translatedText = response.choices[0].message.content?.trim() || '';

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error('Translation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to translate text',
        details: error.message 
      },
      { status: 500 }
    );
  }
}