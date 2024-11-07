import axios from 'axios';
import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { SEARCH_ERROR_MESSAGES } from '@/constants/search_errors';
import { ApiKeyMissingError, ApiRequestError, ApiResponseParsingError } from '@/error/SearchError';

const MEDI_DATA_API_KEY = process.env.DATA_API_KEY;
const MEDI_DATA_API_KEY_DECO = process.env.DATA_API_KEY_DECO;

async function fetchMedicineInfoById(id) {
  if (!MEDI_DATA_API_KEY) {
    throw new ApiKeyMissingError(SEARCH_ERROR_MESSAGES.API_KEY_MISSING);
  }

  const url = `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?ServiceKey=${MEDI_DATA_API_KEY}`;
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    textNodeName: 'text',
    cdataPropName: 'cdata',
  });

  const response = await axios.get(url, {
    params: { item_seq: id, type: 'xml' },
    responseType: 'text',
  });

  if (response.status !== 200) {
    throw new ApiRequestError(`Info API Error: Received status code ${response.status}`);
  }

  const jsonData = parser.parse(response.data);
  return jsonData?.response?.body?.items?.item || null;
}


async function fetchMedicineApprovalInfoById(id) {
  const approvalUrl = `https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnDtlInq05?serviceKey=${MEDI_DATA_API_KEY}&item_seq=${id}&type=xml`;
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    textNodeName: 'text',
    cdataPropName: 'cdata',
  });

  try {
    const response = await axios.get(approvalUrl, { responseType: 'text' });

    if (response.status !== 200) {
      throw new ApiRequestError(`Approval API Error: Status code ${response.status}`);
    }

    const jsonData = parser.parse(response.data);

    return jsonData?.response?.body?.items?.item || null;
  } catch (error) {
    throw new ApiRequestError(`Approval API Error: ${error.message}`);
  }
}


export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ message: SEARCH_ERROR_MESSAGES.MISSING_SEARCH_TERM }, { status: 400 });
  }

  try {
    const [infoResult, approvalResult] = await Promise.all([
      fetchMedicineInfoById(id),
      fetchMedicineApprovalInfoById(id),
    ]);

    if (infoResult && approvalResult && infoResult.ITEM_SEQ === approvalResult.ITEM_SEQ) {
      const combinedData = { ...infoResult, approvalInfo: approvalResult };
      return NextResponse.json(combinedData);
    }

    if (infoResult) {
      return NextResponse.json(infoResult);
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
