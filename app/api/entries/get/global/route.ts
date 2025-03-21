import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

interface Entry {
  id: string;
  content: string;
  theme_id: string;
  thread_id: string | null;
  location: string;
  created_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const entries: Entry[] = await sql<Entry[]>`
      SELECT id, content, theme_id, thread_id, location, created_at
      FROM entries
      ORDER BY created_at DESC
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
