import axios from 'axios';
import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { SEARCH_ERROR_MESSAGES } from '@/constants/search_errors';
import { ApiKeyMissingError, ApiRequestError, ApiResponseParsingError } from '@/error/SearchError';

const MEDI_DATA_API_KEY = process.env.DATA_API_KEY;

async function fetchMedicineInfoById(id: string) {
  if (!MEDI_DATA_API_KEY) {
    throw new ApiKeyMissingError(SEARCH_ERROR_MESSAGES.API_KEY_MISSING);
  }

  const url = `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?ServiceKey=${MEDI_DATA_API_KEY}`;
  const parser = new XMLParser();

  try {
    const response = await axios.get(url, {
      params: {
        item_seq: id,
      },
      responseType: 'text',
    });

    if (!response.data) {
      throw new ApiRequestError(SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR);
    }

    let jsonData;
    try {
      jsonData = parser.parse(response.data);
    } catch (parsingError) {
      throw new ApiResponseParsingError(SEARCH_ERROR_MESSAGES.API_RESPONSE_PARSING_ERROR);
    }

    const item = jsonData?.response?.body?.items?.item || null;
    return item;
  } catch (error) {
    if (error instanceof ApiKeyMissingError || error instanceof ApiRequestError || error instanceof ApiResponseParsingError) {
      throw error;
    }
    throw new ApiRequestError(SEARCH_ERROR_MESSAGES.UNKNOWN_ERROR);
  }
}

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.MISSING_SEARCH_TERM }, { status: 400 });
  }

  try {
    const medicineInfo = await fetchMedicineInfoById(id);

    if (medicineInfo) {
      return NextResponse.json(medicineInfo);
    } else {
      return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.NO_MEDICINE_FOUND }, { status: 404 });
    }
  } catch (error) {
    if (error instanceof ApiKeyMissingError) {
      return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.API_KEY_MISSING }, { status: 500 });
    }
    if (error instanceof ApiRequestError) {
      return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR }, { status: 502 });
    }
    if (error instanceof ApiResponseParsingError) {
      return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.API_RESPONSE_PARSING_ERROR }, { status: 500 });
    }
    return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.NO_MEDICINE_FOUND }, { status: 500 });
  }
}
