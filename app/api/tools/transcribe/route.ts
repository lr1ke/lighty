
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Get form data with audio file
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log(`Received audio file: ${audioFile.size} bytes, type: ${audioFile.type}`);

    // Check if we're dealing with Safari's audio/mp4 format
    const isSafariFormat = audioFile.type.includes('mp4') || audioFile.type.includes('m4a');

    // For Safari audio format, use direct REST API approach
    if (isSafariFormat) {
      try {
        console.log('Safari audio format detected, using direct API approach');
        
        // Create form data for OpenAI API
        const formDataForOpenAI = new FormData();
        formDataForOpenAI.append('file', audioFile);
        formDataForOpenAI.append('model', 'whisper-1');
        
        // Make direct API call to OpenAI
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: formDataForOpenAI,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('OpenAI API error:', errorData);
          throw new Error(`${response.status} ${errorData.error?.message || response.statusText}`);
        }
        
        const transcriptionResult = await response.json();
        return NextResponse.json({ text: transcriptionResult.text });
      } catch (directApiError: any) {
        console.error('Direct API call failed:', directApiError);
        
        // Try alternate approach with file extension
        try {
          console.log('Trying alternate approach with explicit file extension');
          
          const arrayBuffer = await audioFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          // Explicitly set file extension and MIME type
          const transcription = await openai.audio.transcriptions.create({
            model: "whisper-1",
            file: new File([buffer], "audio.mp3", { type: "audio/mpeg" }),
          });
          
          return NextResponse.json({ text: transcription.text });
        } catch (fallbackError: any) {
          console.error('Fallback approach failed:', fallbackError);
          throw fallbackError;
        }
      }
    } 
    // For standard formats like WebM, WAV, etc.
    else {
      console.log('Standard audio format detected, using OpenAI SDK');
      
      // Convert to buffer for the OpenAI API
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Determine correct file extension based on MIME type
      let fileName = "audio.webm";
      let fileType = audioFile.type;
      
      if (audioFile.type.includes('wav')) {
        fileName = "audio.wav";
      } else if (audioFile.type.includes('ogg')) {
        fileName = "audio.ogg";
      } else if (audioFile.type.includes('mp3')) {
        fileName = "audio.mp3";
      }
      
      const transcription = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: new File([buffer], fileName, { type: fileType }),
      });
      
      return NextResponse.json({ text: transcription.text });
    }
  } catch (apiError: any) {
    console.error('OpenAI API error:', apiError);
    
    // Add more detailed error info for debugging
    let errorDetails = apiError.message;
    if (apiError.response?.data) {
      try {
        errorDetails = JSON.stringify(apiError.response.data);
      } catch (e) {
        // If JSON stringification fails, use the original message
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Transcription failed',
        details: errorDetails,
        code: apiError.code || apiError.status
      },
      { status: apiError.status || 500 }
    );
  }
}