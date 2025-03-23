import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

interface Entry {
  id: string;
  content: string;
  theme_id: string;
  theme_name: string;
  thread_id: string | null;
  city: string | null;
  state: string | null;
  location: string | null;
  created_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);


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
        entries.created_at
      FROM entries
      JOIN themes ON entries.theme_id = themes.id
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
