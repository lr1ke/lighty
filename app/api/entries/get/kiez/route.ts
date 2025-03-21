import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const entries = await sql`
      SELECT id, content, city, state, created_at
      FROM entries
      WHERE city IS NOT NULL
      ORDER BY city ASC, created_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('Error fetching kiez entries:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
