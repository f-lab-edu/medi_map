import fetch from 'node-fetch';
import { Pharmacy } from '@/models';

const BASE_URL = 'http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire';
const API_KEY = process.env.DATA_API_KEY;
const NUM_OF_ROWS = 1000;

// API URL 생성 함수
function buildUrl(pageNo: number, numOfRows: number = NUM_OF_ROWS): string {
  return `${BASE_URL}?serviceKey=${API_KEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&_type=json`;
}

// 데이터를 가져와 파싱하는 함수
async function fetchPageData(pageNo: number): Promise<any[]> {
  const url = buildUrl(pageNo);
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Error fetching page ${pageNo}: ${response.statusText}`);
    return [];
  }

  const data = await response.json();
  return data.response.body.items.item || [];
}

// 약국 데이터를 데이터베이스에 저장
async function savePharmacyData(items: any[]) {
  const upsertPromises = items.map(item =>
    Pharmacy.upsert({
      dutyName: item.dutyName,
      dutyAddr: item.dutyAddr,
      dutyTel1: item.dutyTel1,
      wgs84Lat: parseFloat(item.wgs84Lat),
      wgs84Lon: parseFloat(item.wgs84Lon),
      dutyTime1s: item.dutyTime1s,
      dutyTime1c: item.dutyTime1c,
      dutyTime2s: item.dutyTime2s,
      dutyTime2c: item.dutyTime2c,
      dutyTime3s: item.dutyTime3s,
      dutyTime3c: item.dutyTime3c,
      dutyTime4s: item.dutyTime4s,
      dutyTime4c: item.dutyTime4c,
      dutyTime5s: item.dutyTime5s,
      dutyTime5c: item.dutyTime5c,
      dutyTime6s: item.dutyTime6s,
      dutyTime6c: item.dutyTime6c,
      dutyTime7s: item.dutyTime7s,
      dutyTime7c: item.dutyTime7c,
      hpid: item.hpid,
    }));

  // 모든 데이터 저장 Promise 처리
  await Promise.all(upsertPromises);
}

// 약국 데이터를 업데이트하는 메인 함수
export async function updatePharmacyData() {
  try {
    // 첫 번째 요청으로 총 페이지 수 계산
    const firstUrl = buildUrl(1, 1);
    const firstResponse = await fetch(firstUrl);
    const firstData = await firstResponse.json();
    const totalCount = parseInt(firstData.response.body.totalCount, 10);
    const totalPages = Math.ceil(totalCount / NUM_OF_ROWS);

    console.log(`Total pages to fetch: ${totalPages}`);

    // 모든 페이지 데이터를 병렬로 가져옴
    const pagePromises = Array.from({ length: totalPages }, (_, index) =>
      fetchPageData(index + 1));
    const allPageData = await Promise.all(pagePromises);

    // 데이터베이스에 저장
    for (const items of allPageData) {
      await savePharmacyData(items);
    }

    console.log('Pharmacy data update complete.');
  } catch (error) {
    console.error('Error updating pharmacy data:', error);
    throw error;
  }
}
