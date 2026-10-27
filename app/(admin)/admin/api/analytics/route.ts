import { NextResponse } from 'next/server';
import { getDeviceUsed, getMostVisitedPages, getTotalVisitorPerDay, getTrafficbyCountry } from '@/lib/analytics';

export async function GET() {
  try {
    const mostvisited = await getMostVisitedPages();
    const trafficbycountry = await getTrafficbyCountry();
    const deviceused = await getDeviceUsed();
    const totalvisitorperday = await getTotalVisitorPerDay();
    return NextResponse.json({mostvisited: mostvisited, trafficbycountry: trafficbycountry, deviceused: deviceused, totalvisitorperday: totalvisitorperday}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}