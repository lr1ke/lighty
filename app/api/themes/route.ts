// pages/api/themes.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
import { NextResponse } from 'next/server';


interface Theme {
  id: string;
  name: string;
}


export async function GET() {
    try {
      const themes = await sql`SELECT id, name FROM themes ORDER BY name ASC;`;
      return NextResponse.json({ themes }, { status: 200 });
    } catch (error) {
      console.error('Error fetching themes:', error);
      return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
    }
  }