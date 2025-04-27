// import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { text, targetLang } = await req.json();
    
//     if (!text || !targetLang) {
//       return NextResponse.json(
//         { error: 'Text and target language are required' },
//         { status: 400 }
//       );
//     }

//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content: `Translate the following text into ${targetLang}. Maintain all original spacing, punctuation, and formatting.`,
//         },
//         { role: "user", content: text },
//       ],
//     });

//     const translatedText = response.choices[0].message.content?.trim() || '';

//     return NextResponse.json({ translatedText });
//   } catch (error: any) {
//     console.error('Translation error:', error);
    
//     return NextResponse.json(
//       { 
//         error: 'Failed to translate text',
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Get request data
    const { text, targetLanguage = 'English' } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // Default to translating to English if no target language specified
    const systemPrompt = `Translate the following text into ${targetLanguage}. 
    Only return the translated text, with no additional commentary.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",  // Using latest model, adjust as needed
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          { 
            role: "user", 
            content: text 
          },
        ],
        temperature: 0.3, // Lower temperature for more accurate translations
      });

      const translatedText = completion.choices[0].message.content?.trim() || '';
            
      return NextResponse.json({ 
        translatedText,
        sourceText: text,
        targetLanguage
      });
    } catch (apiError: any) {
      console.error('OpenAI API error:', apiError);
      return NextResponse.json(
        { 
          error: 'Translation failed',
          details: apiError.message,
          code: apiError.code || apiError.status
        },
        { status: apiError.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Error processing translation request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process translation',
        details: error.message 
      },
      { status: 500 }
    );
  }
}