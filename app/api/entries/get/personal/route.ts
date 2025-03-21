import { NextRequest, NextResponse } from 'next/server';
// import { getAuthenticatedUserId } from '@/lib/auth'; // Your auth helper

import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });



export async function GET(req: NextRequest) {
    try {
        // const user_id = await getAuthenticatedUserId(req);
        const user_id = "c2b008fb-9eae-4aef-bbde-49898dab8c78";
        if (!user_id) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }


    // ✅ Fetch all entries for the user
    const entries = await sql`
     SELECT * FROM entries WHERE user_id = ${user_id} ORDER BY created_at DESC
  `;

  return NextResponse.json(entries, { status: 200 });

} catch (error) {
  console.error('Error fetching entries:', error instanceof Error ? error.message : error);
  return NextResponse.json({ error: 'Server error' }, { status: 500 });
}
}

