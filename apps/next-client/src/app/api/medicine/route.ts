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
async function fetchMedicineInfo(
  name: string,
  pageNo: number,
  numOfRows: number,
  entpName?: string
): Promise<MedicineResultDto[]> {
  if (!MEDI_DATA_API_KEY) {
    throw new ApiKeyMissingError(SEARCH_ERROR_MESSAGES.API_KEY_MISSING);
  }

  const url = `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?ServiceKey=${MEDI_DATA_API_KEY}`;

  try {
    const params: {
      item_name?: string;
      entp_name?: string;
      pageNo: number;
      numOfRows: number;
    } = {
      item_name: name || undefined,
      entp_name: entpName || undefined,
      pageNo,
      numOfRows,
    };

    const response: AxiosResponse<string> = await axios.get(url, {
      params,
      responseType: 'text',
    });

    validateApiResponse(response, SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR);
    const jsonData = parseXmlResponse(response.data);
    const items = jsonData?.response?.body?.items?.item || [];

    return Array.isArray(items) ? (items as MedicineResultDto[]) : [items] as MedicineResultDto[];
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
  const pageNo = parseInt(searchParams.get('page') || '1', 10);
  const numOfRows = parseInt(searchParams.get('limit') || '10', 10);

  if (!name && !entpName) {
    return NextResponse.json(
      { message: '약물 이름이나 업체 이름을 입력해야 합니다.' },
      { status: 400 }
    );
  }

  try {
    const medicineInfo = await fetchMedicineInfo(name, pageNo, numOfRows, entpName);

    return NextResponse.json({
      results: medicineInfo,
      total: medicineInfo.length,
    });
  } catch (error: unknown) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
}
