


import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(req: NextRequest, { params: { threadId } }: { params: { threadId: string } }) {

    if (!threadId) {
      return NextResponse.json({ error: 'Missing thread ID' }, { status: 400 });
    }
    try {

    // ✅ Fetch thread metadata
    const threadResult = await sql`
      SELECT id, title, description, created_at 
      FROM threads 
      WHERE id = ${threadId};
    `;

    if (threadResult.length === 0) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    const thread = threadResult[0];

    // ✅ Fetch entries for the thread
    const entries = await sql`
      SELECT 
        id as entry_id, 
        content, 
        created_at as entry_created_at, 
        theme_id 
      FROM entries 
      WHERE thread_id = ${threadId}
      ORDER BY created_at DESC;
    `;

    return NextResponse.json({ thread, entries }, { status: 200 });

  } catch (error) {
    console.error('Error fetching thread entries:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

