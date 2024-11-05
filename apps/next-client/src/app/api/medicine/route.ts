import axios from 'axios';
import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

const MEDI_DATA_API_KEY = process.env.DATA_API_KEY;

async function fetchMedicineInfo(name, pageNo, numOfRows) {
  const url = `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?ServiceKey=${MEDI_DATA_API_KEY}`;
  const parser = new XMLParser();
  
  try {
    const response = await axios.get(url, {
      params: {
        item_name: name,
        pageNo,
        numOfRows,
      },
      responseType: 'text',
    });

    const jsonData = parser.parse(response.data);

    const items = jsonData?.response?.body?.items?.item || [];
    return Array.isArray(items) ? items : [items];

  } catch (error) {
    throw new Error('fetchMedicineInfo 함수에서 오류 발생');
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '';
  const pageNo = parseInt(searchParams.get('page') || '1');
  const numOfRows = parseInt(searchParams.get('limit') || '10');

  if (!name) {
    return NextResponse.json({ message: '검색어를 입력해 주세요.' }, { status: 400 });
  }

  try {
    const medicineInfo = await fetchMedicineInfo(name, pageNo, numOfRows);

    return NextResponse.json({
      results: medicineInfo,
      total: medicineInfo.length,
    });
  } catch (error) {
    return NextResponse.json({ message: '약물 정보를 불러오는 데 실패했습니다.' }, { status: 500 });
  }
}
