import { AxiosResponse } from 'axios';
import { axiosInstance } from '@/services/axiosInstance';
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
  // API 키 누락 에러
  if (error instanceof ApiKeyMissingError) {
    return { message: SEARCH_ERROR_MESSAGES.API_KEY_MISSING, status: 500 };
  }
  // API 요청 실패 에러
  if (error instanceof ApiRequestError) {
    return { message: SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR, status: 502 };
  }
  // API 파싱 에러
  if (error instanceof ApiResponseParsingError) {
    return { message: SEARCH_ERROR_MESSAGES.API_RESPONSE_PARSING_ERROR, status: 500 };
  }
  // 그 외의 에러 처리
  return { message: SEARCH_ERROR_MESSAGES.NO_MEDICINE_FOUND, status: 500 };
}

// 1. 의약품 정보 API 호출 함수
async function fetchMedicineInfo(name: string, pageNo: number, numOfRows: number): Promise<MedicineResultDto[]> {
  if (!MEDI_DATA_API_KEY) {
    throw new ApiKeyMissingError(SEARCH_ERROR_MESSAGES.API_KEY_MISSING);
  }

  const url = `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?ServiceKey=${MEDI_DATA_API_KEY}`;

  try {
    const response = await axiosInstance.get(url, {
      params: { item_name: name, pageNo, numOfRows },
      responseType: 'text',
    });

    // 응답 상태 확인 (공통 함수 사용)
    validateApiResponse(response, SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR);

    // XML 데이터를 JSON으로 파싱
    const jsonData = parseXmlResponse(response.data);
    const items = jsonData?.response?.body?.items?.item || [];

    return Array.isArray(items) ? items as MedicineResultDto[] : [items] as MedicineResultDto[];
  } catch (error: unknown) {
    if (error instanceof ApiKeyMissingError || error instanceof ApiRequestError || error instanceof ApiResponseParsingError) {
      throw error;
    }
    throw new ApiRequestError(SEARCH_ERROR_MESSAGES.UNKNOWN_ERROR);
  }
}

// 2. GET 요청 핸들러 함수
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '';
  const pageNo = parseInt(searchParams.get('page') || '1', 10);
  const numOfRows = parseInt(searchParams.get('limit') || '10', 10);

  if (!name) {
    return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.MISSING_SEARCH_TERM }, { status: 400 });
  }

  try {
    const medicineInfo = await fetchMedicineInfo(name, pageNo, numOfRows);

    return NextResponse.json({
      results: medicineInfo,
      total: medicineInfo.length,
    });
  } catch (error: unknown) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
}