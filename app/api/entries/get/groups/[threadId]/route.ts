
// import { NextRequest, NextResponse } from 'next/server';
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// export async function GET(req: NextRequest) {
//   try {
//     // Extract threadId from the URL
//     const url = new URL(req.url);
//     const pathnameParts = url.pathname.split('/');
//     const threadId = pathnameParts[pathnameParts.length - 1];

//     if (!threadId) {
//       return NextResponse.json({ error: 'Missing thread ID' }, { status: 400 });
//     }

//     const threadResult = await sql`
//       SELECT id, title, description, created_at
//       FROM threads
//       WHERE id = ${threadId}
//     `;

//     const entriesResult = await sql`
//       SELECT
//         e.id AS entry_id,
//         e.content,
//         e.created_at AS entry_created_at,
//         e.theme_id,
//         t.name AS theme_name,
//         e.thread_id
//       FROM entries e
//       LEFT JOIN themes t ON e.theme_id = t.id
//       WHERE e.thread_id = ${threadId}
//       ORDER BY e.created_at DESC
//     `;

//     return NextResponse.json(
//       {
//         thread: threadResult[0] || null,
//         entries: entriesResult,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error fetching thread entries:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }


// import { NextRequest, NextResponse } from 'next/server';
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const threadId = searchParams.get('threadId');
//     console.log('Fetching Thread ID:', threadId);

//     if (!threadId) {
//       return NextResponse.json({ error: 'Missing threadId' }, { status: 400 });
//     }

//     const thread = await sql`
//       SELECT * FROM threads WHERE id = ${threadId}
//     `;

//     const entries = await sql`
//       SELECT 
//         e.id AS entry_id,
//         e.content,
//         e.created_at AS entry_created_at,
//         e.theme_id,
//         t.name AS theme_name
//       FROM entries e
//       LEFT JOIN themes t ON e.theme_id = t.id
//       WHERE e.thread_id = ${threadId}
//       ORDER BY e.created_at DESC
//     `;

//     return NextResponse.json({
//       thread: thread[0] || null,
//       entries,
//     });
//   } catch (error) {
//     console.error('Error fetching group entries:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }


// import { NextRequest, NextResponse } from 'next/server';
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// export async function GET(req: NextRequest, context: { params: { threadId: string } }) {
//   try {
//     const { threadId } = context.params;

//     if (!threadId) {
//       return NextResponse.json({ error: 'Missing thread ID' }, { status: 400 });
//     }

//     // ✅ Fetch thread metadata
//     const threadResult = await sql`
//       SELECT id, title, description, created_at 
//       FROM threads 
//       WHERE id = ${threadId};
//     `;

//     if (threadResult.length === 0) {
//       return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
//     }

//     const thread = threadResult[0];

//     // ✅ Fetch entries for the thread
//     const entries = await sql`
//       SELECT 
//         id as entry_id, 
//         content, 
//         created_at as entry_created_at, 
//         theme_id 
//       FROM entries 
//       WHERE thread_id = ${threadId}
//       ORDER BY created_at DESC;
//     `;

//     return NextResponse.json({ thread, entries }, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching thread entries:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }


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

