import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface EntryRequestBody {
  content: string;
  theme_id: string;
  location: LocationCoords;
}

export async function POST(req: NextRequest) {
  try {
    const { content, theme_id, location }: EntryRequestBody = await req.json();

    if (!content || !theme_id || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let city = 'Unknown';
    let state = 'Unknown';
    let country = 'Unknown';

    try {
      // ✅ Geolocation API for production requires a token
    //   const geoRes = await fetch(`https://ipinfo.io/${location.latitude},${location.longitude}/json?token=YOUR_TOKEN`); 
    //   if (geoRes.ok) {
    //     const geoData = await geoRes.json();
    //     if (geoData) {
    //       if (geoData.city) city = geoData.city;
    //       if (geoData.region) state = geoData.region;
    //       if (geoData.country) country = geoData.country;
    //     }
    //   } else {
    //     console.warn('Geolocation API returned non-200 response');
    //   }
    // } catch (geoError) {
    //   console.warn('Geolocation fetch failed:', geoError);
    // }

    try {
      const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}+${location.longitude}&key=YOUR_API_KEY`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const components = geoData?.results?.[0]?.components;
        if (components) {
          if (components.city) city = components.city;
          else if (components.town) city = components.town;
          else if (components.village) city = components.village;

          if (components.state) state = components.state;
          if (components.country_code) country = components.country_code.toUpperCase();
        }
      } else {
        console.warn('Geolocation API returned non-200 response');
      }
    } catch (geoError) {
      console.warn('Geolocation fetch failed:', geoError);
      // Hardcoded fallback for local testing
      city = 'Berlin';
      state = 'Berlin';
      country = 'DE';
    }

    const geoPoint = sql`ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)`;

    await sql`
      INSERT INTO entries (content, theme_id, location, city, state, country)
      VALUES (${content}, ${theme_id}, ${geoPoint}, ${city}, ${state}, ${country});
    `;

    return NextResponse.json({ message: 'Entry created successfully' }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    console.error('Error creating entry:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}







// import { NextRequest, NextResponse } from 'next/server';
// // import { getAuthenticatedUserId } from '@/lib/auth'; // Your auth helper

// import postgres from 'postgres';
// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });



// export async function POST(req: NextRequest) {
//   try {
//     // const user_id = await getAuthenticatedUserId(req);
//     const user_id = "a05602c5-6ace-4819-91f3-bb0e0f329c85";
//     if (!user_id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     const { content, theme_id, location } = await req.json();
//     console.log({ content, theme_id, location }); // Log the input data


//     // ✅ Validate content
//     if (!content || content.length > 500) {
//       return NextResponse.json({ error: 'Content too long or missing' }, { status: 400 });
//     }

//     // ✅ Validate theme exists
//     const themeCheck = await sql`SELECT id FROM themes WHERE id = ${theme_id}`;
//     if (themeCheck.length === 0) {
//       return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
//     }

//     // ✅ Check entry limit (3 per day)
//     const todayStart = new Date();
//     todayStart.setUTCHours(0, 0, 0, 0);
//     const entryCount = await sql`
//       SELECT COUNT(*) FROM entries
//       WHERE user_id = ${user_id} AND created_at >= ${todayStart}
//     `;
//     if (Number(entryCount[0].count) >= 3) {
//       return NextResponse.json({ error: 'Daily entry limit reached' }, { status: 429 });
//     }

//     // ✅ Fetch user's single thread_id (if any)
//     const threadResult = await sql`
//       SELECT thread_id FROM user_permissions WHERE user_id = ${user_id} LIMIT 1
//     `;
//     const assignedThreadId = threadResult.length > 0 ? threadResult[0].thread_id : null;

//     // Prepare location (optional)
//     let geoPoint = null;
//     if (location && typeof location === 'object' && location.longitude && location.latitude) {
//       geoPoint = sql`ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)`;
//     } else if (location) {
//       console.warn('Location is not in the expected format. Expected an object with longitude and latitude.');
//     }

//     // // ✅ Prepare city (optional)
//     // const city = location.city || null;

//     // ✅ Insert entry with theme + thread (if any) + location (if any)
//     await sql`
//       INSERT INTO entries (user_id, theme_id, thread_id, content, location)
//       VALUES (${user_id}, ${theme_id}, ${assignedThreadId}, ${content}, ${geoPoint})
//     `;

//     return NextResponse.json({ message: 'Entry created successfully' }, { status: 201 });

//   } catch (error) {
//     console.error('Entry creation error:', error instanceof Error ? error.message : error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }