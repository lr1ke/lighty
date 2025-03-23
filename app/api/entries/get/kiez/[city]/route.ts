import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(req: NextRequest, context: { params: { city: string } }) {
  try {
    console.log("Incoming request:", req.url);
    const { city } = context.params;

    if (!city) {
      return NextResponse.json({ error: 'Missing city' }, { status: 400 });
    }

    const entries = await sql`
      SELECT id, content, created_at, theme_id, city FROM entries
      WHERE city = ${city}
      ORDER BY created_at DESC;
    `;

    // const entries = await sql`
    // SELECT entries.id, entries.content, entries.created_at, entries.theme_id, themes.name AS theme_name
    // FROM entries
    // JOIN themes ON entries.theme_id = themes.id
    // WHERE entries.theme_id = ${kiezId}
    // ORDER BY entries.created_at DESC;
    // `;
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('Error fetching theme entries:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
