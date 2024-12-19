import { NextRequest, NextResponse } from 'next/server';
import { PharmacyDataError } from '@/error/PharmacyError';
import { ERROR_MESSAGES } from '@/constants/errors';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: ERROR_MESSAGES.VALIDATION_ERROR }, { status: 400 });
  }

  const url = buildPharmacyApiUrl(lat, lng);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new PharmacyDataError(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
    }

    const data = await response.json();
    const pharmacies = data.response?.body?.items || [];

    return NextResponse.json(pharmacies);
  } catch (error) {
    const errorMessage = error instanceof PharmacyDataError 
      ? error.message 
      : ERROR_MESSAGES.PHARMACY_DATA_ERROR;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

function buildPharmacyApiUrl(lat: string, lng: string): string {
  const API_KEY = process.env.NEXT_PUBLIC_DATA_API_KEY;
  const baseUrl = 'http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire';
  return `${baseUrl}?serviceKey=${API_KEY}&WGS84_LAT=${lat}&WGS84_LON=${lng}&numOfRows=100&pageNo=1&_type=json`;
}
