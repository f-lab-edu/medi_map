import { Medicine } from '@/models/medicine';
import { MedicineDesc } from '@/models/medicineDesc';
import axios from 'axios';
import moment from 'moment';
import { MedicineData, JoinedMedicine } from '@/types/medicine.types';
import { ValidationError, DatabaseError, APIError, DataParsingError } from '@/error/CommonError';
import { ERROR_MESSAGES } from '@/constants/errors';

const BASE_URL = 'http://apis.data.go.kr/1471000';
const API_KEY = process.env.DATA_API_KEY;
const NUM_OF_ROWS = 100;
const REQUEST_DELAY = 500;

// 안전한 에러 메시지 추출 함수
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

// 1. 의약품 공공 데이터 가져오기
export async function syncMedicines(): Promise<void> {
  const urlBase = `${BASE_URL}/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?ServiceKey=${API_KEY}&type=json&numOfRows=${NUM_OF_ROWS}`;

  try {
    const initialData = await axios.get(`${urlBase}&pageNo=1`);
    const totalCount = initialData.data.body?.totalCount;

    if (totalCount === undefined) {
      throw new DataParsingError(ERROR_MESSAGES.DATA_PARSING_ERROR);
    }

    const totalPages = Math.ceil(totalCount / NUM_OF_ROWS);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    for (const pageNo of pageNumbers) {
      try {
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));

        const response = await axios.get(`${urlBase}&pageNo=${pageNo}`);
        const medicines = response.data.body.items || [];

        const upsertPromises = medicines.map(async (medicine: MedicineData) => {
          try {
            if (!medicine?.ITEM_SEQ) {
              console.warn(`Skipping record with missing ITEM_SEQ on page ${pageNo}`);
              return;
            }

            const formattedPermitDate = medicine.ITEM_PERMIT_DATE
              ? moment(medicine.ITEM_PERMIT_DATE, 'YYYYMMDD').format('YYYY-MM-DD')
              : null;

            await Medicine.upsert({
              itemSeq: medicine.ITEM_SEQ,
              itemName: medicine.ITEM_NAME,
              entpName: medicine.ENTP_NAME,
              itemPermitDate: formattedPermitDate,
              chart: medicine.CHART,
              colorClass1: medicine.COLOR_CLASS1,
              className: medicine.CLASS_NAME,
              etcOtcName: medicine.ETC_OTC_NAME,
              itemImage: medicine.ITEM_IMAGE,
              formCodeName: medicine.FORM_CODE_NAME,
              drugShape: medicine.DRUG_SHAPE,
              lengLong: medicine.LENG_LONG ?? null,
              lengShort: medicine.LENG_SHORT ?? null,
              thick: medicine.THICK ?? null,
            });
          } catch (innerError: unknown) {
            throw new DatabaseError(
              `${ERROR_MESSAGES.UPDATE_ERROR}: ${medicine.ITEM_SEQ}, ${getErrorMessage(innerError)}`
            );
          }
        });

        await Promise.all(upsertPromises);
      } catch (pageError: unknown) {
        throw new APIError(`${ERROR_MESSAGES.API_ERROR} (Page ${pageNo}): ${getErrorMessage(pageError)}`);
      }
    }

    console.log('All Medicine data synced successfully.');

  } catch (error: unknown) {
    console.error(`${ERROR_MESSAGES.MEDICINE.SYNC_MEDICINE_ERROR}: ${getErrorMessage(error)}`);
    throw error;
  }
}

// 2. 의약품 공공 상세 데이터 가져오기
export async function syncApprovals(): Promise<void> {
  const urlBase = `${BASE_URL}/DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnDtlInq05?serviceKey=${API_KEY}&type=json&numOfRows=${NUM_OF_ROWS}`;

  try {
    const initialResponse = await axios.get(`${urlBase}&pageNo=1`);
    const totalCount = initialResponse.data.body?.totalCount;

    if (totalCount === undefined) {
      throw new DataParsingError(ERROR_MESSAGES.DATA_PARSING_ERROR);
    }

    const totalPages = Math.ceil(totalCount / NUM_OF_ROWS);

    for (let pageNo = 1; pageNo <= totalPages; pageNo++) {
      try {
        const response = await axios.get(`${urlBase}&pageNo=${pageNo}`);
        const approvals = response.data.body?.items || [];

        for (const approval of approvals) {
          try {
            if (!approval.ITEM_SEQ) {
              console.warn(`Skipping record with missing ITEM_SEQ on page ${pageNo}`);
              continue;
            }

            await MedicineDesc.upsert({
              itemSeq: approval.ITEM_SEQ,
              itemName: approval.ITEM_NAME || null,
              itemEngName: approval.ITEM_ENG_NAME || null,
              indutyType: approval.INDUTY_TYPE || null,
              makeMaterialFlag: approval.MAKE_MATERIAL_FLAG || null,
              storageMethod: approval.STORAGE_METHOD || null,
              validTerm: approval.VALID_TERM || null,
              packUnit: approval.PACK_UNIT || null,
              meterialName: approval.MATERIAL_NAME || null,
              eeDocData: approval.EE_DOC_DATA || null,
              udDocData: approval.UD_DOC_DATA || null,
              nbDocData: approval.NB_DOC_DATA || null,
            });
          } catch (innerError: unknown) {
            throw new DatabaseError(
              `${ERROR_MESSAGES.UPDATE_ERROR}: ${approval.ITEM_SEQ}, ${getErrorMessage(innerError)}`
            );
          }
        }

        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
      } catch (pageError: unknown) {
        throw new APIError(`${ERROR_MESSAGES.API_ERROR} (Page ${pageNo}): ${getErrorMessage(pageError)}`);
      }
    }

    console.log('All approval data synced successfully.');

  } catch (error: unknown) {
    console.error(`${ERROR_MESSAGES.MEDICINE.SYNC_APPROVALS_ERROR}: ${getErrorMessage(error)}`);
    throw error;
  }
}

// 3. 특정 의약품의 기본 정보와 상세 정보를 함께 조회
export async function getJoinedMedicines(itemSeq: string): Promise<JoinedMedicine | null> {
  try {
    const medicine = await Medicine.findOne({
      where: { itemSeq },
      include: [{ model: MedicineDesc, required: false }],
    });

    if (!medicine) {
      throw new ValidationError(ERROR_MESSAGES.MEDICINE.FETCH_JOINED_MEDICINES_ERROR);
    }

    return { ...medicine.get(), ...medicine.MedicineDesc?.get() };
  } catch (error: unknown) {
    console.error(`${ERROR_MESSAGES.MEDICINE.FETCH_JOINED_MEDICINES_ERROR}: ${getErrorMessage(error)}`);
    throw error;
  }
}

// 4. 모든 의약품 정보를 페이지네이션 방식으로 조회
export async function getAllMedicines(page: number, limit: number) {
  try {
    const offset = (page - 1) * limit;

    const medicineQueryResult = await Medicine.findAndCountAll({
      include: [{ model: MedicineDesc, required: false }],
      limit,
      offset,
    });

    if (!medicineQueryResult) {
      throw new ValidationError(ERROR_MESSAGES.MEDICINE.FETCH_ALL_MEDICINES_ERROR);
    }

    return {
      data: medicineQueryResult.rows,
      total: medicineQueryResult.count,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(medicineQueryResult.count / limit),
        limit,
      },
    };
  } catch (error: unknown) {
    console.error(`${ERROR_MESSAGES.MEDICINE.FETCH_ALL_MEDICINES_ERROR}: ${getErrorMessage(error)}`);
    throw error;
  }
}
