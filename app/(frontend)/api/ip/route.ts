import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const latitudeHeader = req.headers.get('cf-iplatitude');
  const longitudeHeader = req.headers.get('cf-iplongitude');
  const latitude = latitudeHeader === null ? null : Number(latitudeHeader);
  const longitude = longitudeHeader === null ? null : Number(longitudeHeader);
  const countryCode = req.headers.get('cf-ipcountry')?.toUpperCase();

  return Response.json({
    latitude: latitude !== null && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 ? latitude : null,
    longitude: longitude !== null && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180 ? longitude : null,
    countryCode: countryCode && /^[A-Z]{2}$/.test(countryCode) ? countryCode : null,
  });
}