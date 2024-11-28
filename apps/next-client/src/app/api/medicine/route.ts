import axios, { AxiosResponse } from 'axios';
import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { SEARCH_ERROR_MESSAGES } from '@/constants/search_errors';
import { ApiKeyMissingError, ApiRequestError, ApiResponseParsingError } from '@/error/SearchError';
import { MedicineResultDto } from '@/dto/MedicineResultDto';

const MEDI_DATA_API_KEY = process.env.DATA_API_KEY;

function validateApiResponse(response: AxiosResponse, errorMessage: string) {
  if (response.status !== 200) {
    throw new ApiRequestError(`${errorMessage}: Received status code ${response.status}`);
  }
}

// XML 응답을 JSON으로 변환하는 공통 함수
function parseXmlResponse(xmlData: string) {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      textNodeName: 'text',
      cdataPropName: 'cdata',
    });
    return parser.parse(xmlData);
  } catch (error: unknown) {
    throw new ApiResponseParsingError(`Failed to parse XML response: ${(error as Error).message}`);
  }
}

function handleError(error: unknown) {
  if (error instanceof ApiKeyMissingError) {
    return { message: SEARCH_ERROR_MESSAGES.API_KEY_MISSING, status: 500 };
  }
  if (error instanceof ApiRequestError) {
    return { message: SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR, status: 502 };
  }
  if (error instanceof ApiResponseParsingError) {
    return { message: SEARCH_ERROR_MESSAGES.API_RESPONSE_PARSING_ERROR, status: 500 };
  }
  return { message: SEARCH_ERROR_MESSAGES.NO_MEDICINE_FOUND, status: 500 };
}

// 1. 의약품 정보 API 호출 함수
async function fetchMedicineInfoAllPages(
  name: string,
  entpName: string,
  color: string,
  numOfRows: number = 10
): Promise<MedicineResultDto[]> {
  if (!MEDI_DATA_API_KEY) {
    throw new ApiKeyMissingError(SEARCH_ERROR_MESSAGES.API_KEY_MISSING);
  }

  const url = `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?ServiceKey=${MEDI_DATA_API_KEY}`;

  try {
    // 1. 첫 번째 요청으로 전체 페이지 수 계산
    const initialResponse: AxiosResponse<string> = await axios.get(url, {
      params: {
        item_name: name || undefined,
        entp_name: entpName || undefined,
        pageNo: 1,
        numOfRows,
      },
      responseType: 'text',
    });

    validateApiResponse(initialResponse, SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR);
    const initialJson = parseXmlResponse(initialResponse.data);

    const totalCount = initialJson?.response?.body?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / numOfRows);

    if (totalCount === 0) return []; // 데이터가 없으면 빈 배열 반환

    // 2. 모든 페이지에 대한 요청 배열 생성
    const pageRequests = Array.from({ length: totalPages }, (_, index) =>
      axios.get(url, {
        params: {
          item_name: name || undefined,
          entp_name: entpName || undefined,
          pageNo: index + 1,
          numOfRows,
        },
        responseType: 'text',
      })
    );

    // 3. 병렬로 모든 페이지 요청 실행
    const responses = await Promise.all(pageRequests);

    // 4. 모든 응답 데이터를 파싱하고, 색상 필터링 적용
    const allResults = responses.flatMap((response) => {
      validateApiResponse(response, SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR);
      const jsonData = parseXmlResponse(response.data);
      const items = jsonData?.response?.body?.items?.item || [];
      return Array.isArray(items) ? items : [items];
    });

    // 5. 색상 필터링
    const filteredResults = allResults.filter((item) =>
      item.COLOR_CLASS1 &&
      color.split(',').some((c) => item.COLOR_CLASS1.includes(c))
    );

    return filteredResults as MedicineResultDto[];
  } catch (error: unknown) {
    if (
      error instanceof ApiKeyMissingError ||
      error instanceof ApiRequestError ||
      error instanceof ApiResponseParsingError
    ) {
      throw error;
    }
    throw new ApiRequestError(SEARCH_ERROR_MESSAGES.UNKNOWN_ERROR);
  }
}


// 2. GET 요청 핸들러 함수
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '';
  const entpName = searchParams.get('entp_name') || '';
  const color = searchParams.get('COLOR_CLASS1') || ''; // 색상 필터링 추가
  const numOfRows = parseInt(searchParams.get('limit') || '10', 10);

  if (!name && !entpName && !color) {
    return NextResponse.json(
      { message: '약물 이름, 업체 이름 또는 색상 중 하나는 입력해야 합니다.' },
      { status: 400 }
    );
  }

  try {
    // 병렬 요청으로 모든 페이지 탐색 및 필터링
    const medicineInfo = await fetchMedicineInfoAllPages(
      name,
      entpName,
      color,
      numOfRows
    );

    return NextResponse.json({
      results: medicineInfo,
      total: medicineInfo.length,
    });
  } catch (error: unknown) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
}


