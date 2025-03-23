import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

interface Entry {
    id: string;
    content: string;
    theme_id: string;
    thread_id: string | null;
    city: string;
    state: string;
    location: string;
    created_at: string;
  }

export async function GET(req: NextRequest) {
  try {
    const entries = await sql`
      SELECT id, content, theme_id, thread_id, city, state, location, created_at 
      FROM entries 
      WHERE city IS NOT NULL 
      ORDER BY city ASC, created_at DESC
    `;
    
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('Error fetching kiez entries:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
