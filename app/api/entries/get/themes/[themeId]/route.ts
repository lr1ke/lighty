import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(req: NextRequest, context: { params: { themeId: string } }) {
  try {
    console.log("Incoming request:", req.url);
    const { themeId } = context.params;

    if (!themeId) {
      return NextResponse.json({ error: 'Missing theme ID' }, { status: 400 });
    }

    // const entries = await sql`
    //   SELECT id, content, created_at, theme_id FROM entries
    //   WHERE theme_id = ${themeId}
    //   ORDER BY created_at DESC;
    // `;

    const entries = await sql`
    SELECT entries.id, entries.content, entries.created_at, entries.theme_id, themes.name AS theme_name
    FROM entries
    JOIN themes ON entries.theme_id = themes.id
    WHERE entries.theme_id = ${themeId}
    ORDER BY entries.created_at DESC;
    `;
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('Error fetching theme entries:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
