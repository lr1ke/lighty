import { NextRequest, NextResponse } from 'next/server';
// import { getAuthenticatedUserId } from '@/lib/auth'; // Your auth helper

import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

interface Entry {
  id: string;
  content: string;
  theme_id: string;
  theme_name: string;
  thread_id: string | null;
  thread_title: string | null;
  city: string | null;
  state: string | null;
  location: string | null;
  created_at: string;
}

export async function GET(req: NextRequest) {
    try {
        // const user_id = await getAuthenticatedUserId(req);
        const user_id = "a05602c5-6ace-4819-91f3-bb0e0f329c85";
        if (!user_id) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const limit = 50;
        const offset = 0;

    const entries: Entry[] = await sql<Entry[]>`
      SELECT 
        entries.id, 
        entries.content, 
        entries.theme_id, 
        themes.name AS theme_name,
        entries.thread_id, 
        entries.city, 
        entries.state, 
        entries.location, 
        entries.created_at,
        threads.title AS thread_title  
      FROM entries
      LEFT JOIN themes ON entries.theme_id = themes.id
      LEFT JOIN threads ON entries.thread_id = threads.id
      WHERE entries.user_id = ${user_id}
      ORDER BY entries.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return NextResponse.json(entries, {
      status: 200,
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate' },
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    console.error('Error fetching entries:', message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
