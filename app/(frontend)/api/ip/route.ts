import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] || // Proxy-aware
    req.headers.get('x-real-ip') ||                      // Some proxies use this
    'Unknown IP';

  return new Response(JSON.stringify({ ip }), {
    headers: { 'Content-Type': 'application/json' },
  });
}