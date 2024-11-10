import axios, { AxiosResponse } from 'axios';
import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { SEARCH_ERROR_MESSAGES } from '@/constants/search_errors';
import { ApiRequestError, ApiResponseParsingError, ApiKeyMissingError } from '@/error/SearchError';

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

// 1. 의약품 정보 API 호출 함수
async function fetchMedInfoById(id: string) {
  const url = `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?ServiceKey=${MEDI_DATA_API_KEY}`;

  try {
    const response = await axios.get(url, {
      params: { item_seq: id, type: 'xml' },
      responseType: 'text',
    });

    // 응답 상태 확인 (공통 함수 사용)
    validateApiResponse(response, 'Medicine Info API Error');

    // XML 데이터를 JSON으로 파싱하여 반환
    const jsonData = parseXmlResponse(response.data);
    return jsonData?.response?.body?.items?.item || null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new ApiRequestError(`Info API Error: ${error.message}, URL: ${url}`);
    } else {
      throw error;
    }
  }
}

// 2. 의약품 승인 정보 API 호출 함수
async function fetchMediAppInfoById(id: string) {
  const approvalUrl = `https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnDtlInq05?serviceKey=${MEDI_DATA_API_KEY}&item_seq=${id}&type=xml`;

  try {
    const response = await axios.get(approvalUrl, { responseType: 'text' });

    validateApiResponse(response, SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR);

    // XML 데이터를 JSON으로 파싱하여 반환
    const jsonData = parseXmlResponse(response.data);
    return jsonData?.response?.body?.items?.item || null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new ApiRequestError(`Approval API Error: ${error.message}, URL: ${approvalUrl}`);
    } else {
      throw error;
    }
  }
}

// 3. GET 요청 핸들러 함수
export async function GET(request: Request) {
  if (!MEDI_DATA_API_KEY) {
    return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.API_KEY_MISSING }, { status: 500 });
  }

  const { pathname } = new URL(request.url);
  const id = pathname.split('/').pop();

  // ID 누락 에러
  if (!id) {
    return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.MISSING_SEARCH_TERM }, { status: 400 });
  }

  try {
    // 의약품 정보와 승인 정보를 동시에 가져오기
    const [infoResult, approvalResult] = await Promise.all([
      fetchMedInfoById(id),
      fetchMediAppInfoById(id),
    ]);

    // 두 결과가 모두 존재하고, ID가 동일하면 데이터를 합쳐서 반환
    if (infoResult && approvalResult && infoResult.ITEM_SEQ === approvalResult.ITEM_SEQ) {
      const combinedData = { ...infoResult, approvalInfo: approvalResult };
      return NextResponse.json(combinedData);
    }

    if (infoResult) {
      return NextResponse.json(infoResult);
    } else {
      // 의약품 정보가 없을 경우
      return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.NO_MEDICINE_FOUND }, { status: 404 });
    }
  } catch (error: unknown) {
    if (error instanceof ApiResponseParsingError) {
      // API 응답 파싱 에러 처리
      return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.API_RESPONSE_PARSING_ERROR }, { status: 500 });
    }

    // API 요청 실패 에러
    return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR }, { status: 502 });
  }
}