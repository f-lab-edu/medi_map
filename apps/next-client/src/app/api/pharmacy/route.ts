import { NextResponse } from 'next/server';
import { PharmacyDataError } from '@/error/PharmacyError';
import { ERROR_MESSAGES } from '@/constants/errors';
import { PharmacyDTO } from '@/dto/PharmacyDTO';

// GET 요청 핸들러
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: ERROR_MESSAGES.VALIDATION_ERROR }, { status: 400 });
  }

  try {
    // 위도(lat)와 경도(lng)를 기반으로 약국 데이터 가져오기
    const pharmacies = await fetchAllPharmacies(lat, lng);
    return NextResponse.json(pharmacies); // 약국 데이터를 JSON 형식으로 응답
  } catch (error) {
    const errorMessage = error instanceof PharmacyDataError 
      ? error.message 
      : ERROR_MESSAGES.PHARMACY_DATA_ERROR;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// 모든 약국 데이터를 외부 API에서 가져오는 함수
async function fetchAllPharmacies(lat: string, lng: string) {
  const initialUrl = buildPharmacyApiUrl(lat, lng, 1, 1);
  const initialResponse = await fetch(initialUrl);

  if (!initialResponse.ok) {
    throw new PharmacyDataError(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
  }

  const initialData = await initialResponse.json();
  const totalCount = parseInt(initialData.response.body.totalCount, 10);
  const numOfRows = 1000;
  const totalPages = Math.ceil(totalCount / numOfRows);

  // 병렬로 모든 페이지의 데이터를 가져오기
  const requests = Array.from({ length: totalPages }, (_, index) => {
    const pageNo = index + 1;
    const url = buildPharmacyApiUrl(lat, lng, pageNo, numOfRows);
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new PharmacyDataError(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
      }
      return response.json();
    });
  });

  const results = await Promise.all(requests);

  // 모든 페이지의 데이터를 합치기
  const pharmacies: PharmacyDTO[] = results.flatMap((data) => {
    return data.response?.body?.items?.item || [];
  });

  return pharmacies.filter((pharmacy) =>
    isWithinRadius(pharmacy, parseFloat(lat), parseFloat(lng), 2500)
  );
}

// 약국 데이터를 요청할 API URL 생성 함수
function buildPharmacyApiUrl(lat: string, lng: string, pageNo: number, numOfRows: number): string {
  const API_KEY = process.env.DATA_API_KEY;
  const baseUrl = 'http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire';
  return `${baseUrl}?serviceKey=${API_KEY}&WGS84_LAT=${lat}&WGS84_LON=${lng}&numOfRows=${numOfRows}&pageNo=${pageNo}&_type=json`;
}

// 두 좌표 간의 거리를 계산하는 함수 (Haversine 공식 사용)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  const earthRadius = 6371e3;
  const lat1Rad = deg2rad(lat1);
  const lat2Rad = deg2rad(lat2);
  const deltaLatRad = deg2rad(lat2 - lat1);
  const deltaLonRad = deg2rad(lon2 - lon1);

  const haversineLat = Math.sin(deltaLatRad / 2) ** 2;
  const haversineLon = Math.sin(deltaLonRad / 2) ** 2;
  const angularDistance = haversineLat +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * haversineLon;

  const centralAngle = 2 * Math.atan2(Math.sqrt(angularDistance), Math.sqrt(1 - angularDistance));

  return earthRadius * centralAngle;
}

// 주어진 좌표가 특정 반경 내에 있는지 확인하는 함수
function isWithinRadius(pharmacy: PharmacyDTO, centerLat: number, centerLng: number, radius: number): boolean {
  const pharmacyLat = pharmacy.wgs84Lat;
  const pharmacyLng = pharmacy.wgs84Lon;
  const distance = getDistance(centerLat, centerLng, pharmacyLat, pharmacyLng);
  return distance <= radius;
}