
import { NextRequest, NextResponse } from 'next/server';
// import { getAuthenticatedUserId } from '@/lib/auth'; // Your auth helper

import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });



interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

interface EntryRequestBody {
  content: string;
  theme_id: string;
  location?: LocationData;
}

export async function POST(req: NextRequest) {
  try {
    // const user_id = await getAuthenticatedUserId(req);
    const user_id = "c2b008fb-9eae-4aef-bbde-49898dab8c78";
    if (!user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { content, theme_id, location }: EntryRequestBody = await req.json();
    console.log({ content, theme_id, location }); // Log the input data

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

    // ✅ Fetch user's single thread_id (if any)
    const threadResult = await sql`
      SELECT thread_id FROM user_permissions WHERE user_id = ${user_id} LIMIT 1
    `;
    const assignedThreadId = threadResult.length > 0 ? threadResult[0].thread_id : null;

    let geoPoint = null;
    let city = 'Unknown';
    let state = 'Unknown';
    let country = 'Unknown';
    
    // Process location if provided and valid
    if (location && typeof location === 'object' && 
        typeof location.latitude === 'number' && 
        typeof location.longitude === 'number') {
      
      // Create the geo point for PostgreSQL
      geoPoint = sql`ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)`;
      
      // Try to get location info from coordinates
      try {
        const openCageKey = process.env.OPENCAGE_API_KEY;
        
        if (openCageKey) {
          console.log('Attempting to fetch location with OpenCage API...');
    
          const geoRes = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}+${location.longitude}&key=${openCageKey}`
          );
          console.log('OpenCage API status:', geoRes.status);
    
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            console.log('OpenCage API response:', JSON.stringify(geoData));
    
            const components = geoData?.results?.[0]?.components;
            
            if (components) {
              city = components.city || components.town || components.village || city;
              state = components.state || state;
              country = components.country_code?.toUpperCase() || country;
            }
          } else {
            console.warn('OpenCage API returned status:', geoRes.status);
          }
        } else {
          console.warn('Missing OpenCage API key');
        }
      } catch (geoError) {
        console.warn('Geolocation fetch failed:', geoError);
      }
    } else {
      console.log('No valid location coordinates provided');
      
      // Optional: Fallback to IP-based location
      try {
        const ipRes = await fetch('https://ipinfo.io/json');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData) {
            city = ipData.city || city;
            state = ipData.region || state;
            country = ipData.country || country;
          }
        }
      } catch (ipError) {
        console.warn('IP-based location fallback failed:', ipError);
      }
    }

    // ✅ Insert entry with theme + thread (if any) + location (if any)
    await sql`
      INSERT INTO entries (user_id, theme_id, thread_id, content, location, city, state, country)
      VALUES (${user_id}, ${theme_id}, ${assignedThreadId}, ${content}, ${geoPoint}, ${city}, ${state}, ${country})
    `;

    return NextResponse.json({ message: 'Entry created successfully' }, { status: 201 });

  } catch (error) {
    console.error('Entry creation error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}