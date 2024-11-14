// src/app/api/pharmacy/route.ts

import { NextResponse } from 'next/server';
import { PharmacyDataError } from '@/error/PharmaciesError';
import { ERROR_MESSAGES } from '@/constants/errors';
import { PharmacyDTO } from '@/dto/PharmacyDTO';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: ERROR_MESSAGES.VALIDATION_ERROR }, { status: 400 });
  }

  try {
    const pharmacies = await fetchAllPharmacies(lat, lng);
    return NextResponse.json(pharmacies);
  } catch (error) {
    const errorMessage = error instanceof PharmacyDataError 
      ? error.message 
      : ERROR_MESSAGES.PHARMACY_DATA_ERROR;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function fetchAllPharmacies(lat: string, lng: string) {
  const pharmacies: PharmacyDTO[] = [];
  let pageNo = 1;
  const numOfRows = 1000;
  let totalCount = Infinity;

  while (pharmacies.length < totalCount) {
    const url = buildPharmacyApiUrl(lat, lng, pageNo, numOfRows);
    const response = await fetch(url);

    if (!response.ok) {
      throw new PharmacyDataError(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
    }

    const data = await response.json();
    const items = data.response?.body?.items?.item || [];

    pharmacies.push(...items);

    totalCount = parseInt(data.response.body.totalCount, 10); // totalCount 갱신
    pageNo++;
  }

  return pharmacies.filter(pharmacy => isWithinRadius(pharmacy, parseFloat(lat), parseFloat(lng), 1500));
}

function buildPharmacyApiUrl(lat: string, lng: string, pageNo: number, numOfRows: number): string {
  const API_KEY = process.env.DATA_API_KEY;
  const baseUrl = 'http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire';
  return `${baseUrl}?serviceKey=${API_KEY}&WGS84_LAT=${lat}&WGS84_LON=${lng}&numOfRows=${numOfRows}&pageNo=${pageNo}&_type=json`;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  const R = 6371e3;
  const φ1 = deg2rad(lat1);
  const φ2 = deg2rad(lat2);
  const Δφ = deg2rad(lat2 - lat1);
  const Δλ = deg2rad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function isWithinRadius(pharmacy: PharmacyDTO, centerLat: number, centerLng: number, radius: number): boolean {
  const pharmacyLat = pharmacy.wgs84Lat;
  const pharmacyLng = pharmacy.wgs84Lon;
  const distance = getDistance(centerLat, centerLng, pharmacyLat, pharmacyLng);
  return distance <= radius;
}
