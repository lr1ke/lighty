import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, voice, translateTo } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const response = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: voice || "alloy",
      input: text,
      response_format: "mp3",
      speed: 1.0,
    });

    // Convert the response to an ArrayBuffer
    const buffer = await response.arrayBuffer();
    
    // Return the audio data with the correct content type
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error generating speech:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        details: error.message 
      },
      { status: 500 }
    );
  }
}