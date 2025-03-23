import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

interface ThreadEntry {
    entry_id: string;
    content: string;
    entry_created_at: string;
    thread_id: string;
    title: string;
    description: string;
    thread_created_at: string;
  }
  
  export async function GET(req: NextRequest) {
    try {
      const entries: ThreadEntry[] = await sql`
        SELECT 
          entries.id AS entry_id,
          entries.content,
          entries.created_at AS entry_created_at,
          threads.id AS thread_id,
          threads.title,
          threads.description,
          threads.created_at AS thread_created_at
        FROM entries
        JOIN threads ON entries.thread_id = threads.id
        ORDER BY threads.created_at DESC;
      `;
  
      return NextResponse.json(entries, { status: 200 });
    } catch (error) {
      console.error('Error fetching thread entries:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }


// interface Entry {
//     id: string;
//     content: string;
//     theme_id: string;
//     thread_id: string | null;
//     city: string;
//     state: string;
//     location: string;
//     created_at: string;
//   }

// export async function GET(req: NextRequest) {
//   try {
//     const entries = await sql`
//       SELECT *
//       FROM entries 
//       WHERE thread_id IS NOT NULL 
//       ORDER BY thread_id ASC, created_at DESC
//     `;
    
//     return NextResponse.json(entries, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching kiez entries:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
