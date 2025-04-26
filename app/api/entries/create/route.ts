
import { NextRequest, NextResponse } from 'next/server';
// import { getAuthenticatedUserId } from '@/lib/auth'; // Your auth helper

import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
}

interface EntryRequestBody {
  content: string;
  theme_id: string;
  location?: LocationData;
}

export async function POST(req: NextRequest) {
  try {
    // const user_id = await getAuthenticatedUserId(req);
    const user_id = "a05602c5-6ace-4819-91f3-bb0e0f329c85";
    if (!user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { content, theme_id, location }: EntryRequestBody = await req.json();

    // ✅ Validate content
    if (!content || content.length > 500) {
      return NextResponse.json({ error: 'Content too long or missing' }, { status: 400 });
    }

    // ✅ Validate theme exists
    const themeCheck = await sql`SELECT id FROM themes WHERE id = ${theme_id}`;
    if (themeCheck.length === 0) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }

    // ✅ Check entry limit (3 per day/ for testing set to 20 per day)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const entryCount = await sql`
      SELECT COUNT(*) FROM entries
      WHERE user_id = ${user_id} AND created_at >= ${todayStart}
    `;
    if (Number(entryCount[0].count) >= 20) {
      return NextResponse.json({ error: 'Daily entry limit reached' }, { status: 429 });
    }

    // ✅ Fetch user's single thread_id (if any)
    const threadResult = await sql`
      SELECT thread_id FROM user_permissions WHERE user_id = ${user_id} LIMIT 1
    `;
    const assignedThreadId = threadResult.length > 0 ? threadResult[0].thread_id : null;

    let geoPoint = null;
    let city = 'Unknown';
    let state = 'Unknown';
    
// Process location if provided and valid
if (location && 
  typeof location.latitude === 'number' && 
  typeof location.longitude === 'number') {
geoPoint = sql`ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)`;

city = location.city || 'Unknown';
state = location.state || 'Unknown';
console.log('Using location from client:', { city, state, coords: [location.latitude, location.longitude] });
  }

    // ✅ Insert entry with theme + thread (if any) + location (if any)
    await sql`
      INSERT INTO entries (user_id, theme_id, thread_id, content, location, city, state)
      VALUES (${user_id}, ${theme_id}, ${assignedThreadId}, ${content}, ${geoPoint}, ${city}, ${state})
    `;

    return NextResponse.json({ message: 'Entry created successfully' }, { status: 201 });

  } catch (error) {
    console.error('Entry creation error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}