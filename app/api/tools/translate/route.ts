
// import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { text, targetLanguage = 'English' } = await req.json();
    
//     if (!text) {
//       return NextResponse.json(
//         { error: 'No text provided' },
//         { status: 400 }
//       );
//     }

//     // Default to translating to English if no target language specified
//     const systemPrompt = `Translate the following text into ${targetLanguage}. 
//     Only return the translated text, with no additional commentary.`;

//     try {
//       const completion = await openai.chat.completions.create({
//         model: "gpt-4o", 
//         messages: [
//           {
//             role: "system",
//             content: systemPrompt,
//           },
//           { 
//             role: "user", 
//             content: text 
//           },
//         ],
//         temperature: 0.3, 
//       });

//       const translatedText = completion.choices[0].message.content?.trim() || '';

//       return NextResponse.json({ 
//         translatedText,
//         sourceText: text,
//         targetLanguage
//       });
//     } catch (apiError: any) {
//       console.error('OpenAI API error:', apiError);
//       return NextResponse.json(
//         { 
//           error: 'Translation failed',
//           details: apiError.message,
//           code: apiError.code || apiError.status
//         },
//         { status: apiError.status || 500 }
//       );
//     }
//   } catch (error: any) {
//     console.error('Error processing translation request:', error);
//     return NextResponse.json(
//       { 
//         error: 'Failed to process translation',
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
    const body = await req.json();
    const { text, texts, targetLanguage = 'English' } = body;
    
    // Handle array of texts (batch mode)
    if (Array.isArray(texts)) {
      return await handleBatchTranslation(texts, targetLanguage);
    }
    
    // Handle single text
    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    const systemPrompt = `Translate the following text into ${targetLanguage}. 
    Only return the translated text, with no additional commentary.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", 
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
        temperature: 0.3, 
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

// Helper function to handle batch translation
async function handleBatchTranslation(texts: string[], targetLanguage: string) {
  if (!texts || texts.length === 0) {
    return NextResponse.json(
      { error: 'No texts provided for batch translation' },
      { status: 400 }
    );
  }

  try {
    // Process in batches of 5 texts for better performance
    const batchSize = 5;
    const results: string[] = [];
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      // For small batches, we can combine them into a single prompt with markers
      const batchPrompt = `Translate each of the following ${batch.length} texts into ${targetLanguage}.
      Return a JSON array with each translated text, preserving the order:

      ${batch.map((t, idx) => `[Text ${idx+1}]: ${t}`).join('\n\n')}`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a translation assistant. Return only the translations as a JSON array."
          },
          { 
            role: "user", 
            content: batchPrompt 
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0].message.content?.trim() || '{"translations":[]}';
      
      try {
        // Parse the JSON response
        const parsed = JSON.parse(responseText);
        
        // Try different possible response formats
        let translations: string[];
        if (Array.isArray(parsed)) {
          translations = parsed;
        } else if (parsed.translations && Array.isArray(parsed.translations)) {
          translations = parsed.translations;
        } else {
          // Try to extract translations from numbered keys
          translations = [];
          for (let j = 0; j < batch.length; j++) {
            // Try different key patterns
            const value = parsed[j] || parsed[`${j}`] || parsed[`${j+1}`] || parsed[`translation${j+1}`];
            translations.push(value || batch[j]);
          }
        }
        
        results.push(...translations);
      } catch (parseError) {
        console.error('Error parsing batch translation:', parseError);
        // If parsing fails, use empty strings as placeholders
        results.push(...batch.map(() => ''));
      }
    }
    
    return NextResponse.json({
      translations: texts.map((original, idx) => ({
        translatedText: results[idx] || original,
        sourceText: original
      })),
      targetLanguage
    });
  } catch (apiError: any) {
    console.error('OpenAI API error:', apiError);
    return NextResponse.json(
      { 
        error: 'Batch translation failed',
        details: apiError.message,
        code: apiError.code || apiError.status
      },
      { status: apiError.status || 500 }
    );
  }
}