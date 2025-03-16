import { NextRequest, NextResponse } from 'next/server';
// import { getAuthenticatedUserId } from '@/lib/auth'; // Your auth helper

import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });



export async function POST(req: NextRequest) {
//   try {
//     const user_id = await getAuthenticatedUserId(req);
//     if (!user_id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }


    const user_id = "a05602c5-6ace-4819-91f3-bb0e0f329c85";
    const { content, theme_id, location } = await req.json();

    // ✅ Validate content
    if (!content || content.length > 500) {
      return NextResponse.json({ error: 'Content too long or missing' }, { status: 400 });
    }

    // ✅ Validate theme exists
    const themeCheck = await sql`SELECT id FROM themes WHERE id = ${theme_id}`;
    if (themeCheck.length === 0) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }

    // ✅ Check entry limit (3 per day)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const entryCount = await sql`
      SELECT COUNT(*) FROM entries
      WHERE user_id = ${user_id} AND created_at >= ${todayStart}
    `;
    if (Number(entryCount[0].count) >= 3) {
      return NextResponse.json({ error: 'Daily entry limit reached' }, { status: 429 });
    }

    // ✅ Fetch user’s single thread_id (if any)
    const threadResult = await sql`
      SELECT thread_id FROM user_permissions WHERE user_id = ${user_id} LIMIT 1
    `;
    const assignedThreadId = threadResult.length > 0 ? threadResult[0].thread_id : null;

    // ✅ Prepare location (optional)
    const geoPoint = location
      ? sql`ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)`
      : null;

    // ✅ Insert entry with theme + thread (if any) + location (if any)
    await sql`
      INSERT INTO entries (user_id, theme_id, thread_id, content, location)
      VALUES (${user_id}, ${theme_id}, ${assignedThreadId}, ${content}, ${geoPoint})
    `;

    return NextResponse.json({ message: 'Entry created successfully' }, { status: 201 });

  } catch (error) {
    console.error('Entry creation error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
