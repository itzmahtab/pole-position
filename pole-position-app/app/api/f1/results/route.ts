import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: null, source: 'static', stale: false, fetchedAt: new Date().toISOString() });
}
