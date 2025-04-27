// filepath: /Users/ulrike/Desktop/lighty/nextjs-dashboard/app/api/tools/test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKeyInfo = process.env.OPENAI_API_KEY 
    ? { available: true, length: process.env.OPENAI_API_KEY.length, prefix: process.env.OPENAI_API_KEY.substring(0, 3) + '...' }
    : { available: false };
    
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    apiKeyInfo
  });
}