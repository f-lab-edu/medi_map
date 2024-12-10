import { Medicine, MedicineDesc } from '@/models';
import axios from 'axios';
import moment from 'moment';
import { MedicineData, JoinedMedicine } from '@/types/medicine.types';

const BASE_URL = 'http://apis.data.go.kr/1471000';
const API_KEY = process.env.DATA_API_KEY;
const NUM_OF_ROWS = 100;
const FETCH_DELAY = 1000;

// 1. 의약품 공공 데이터 가져오기
export async function syncMedicines(): Promise<void> {
  const urlBase = `${BASE_URL}/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?ServiceKey=${API_KEY}&type=json&numOfRows=${NUM_OF_ROWS}`;

  try {
    const initialData = await axios.get(`${urlBase}&pageNo=1`);
    const totalCount = initialData.data.body?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / NUM_OF_ROWS);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    await Promise.all(
      pageNumbers.map(async pageNo => {
        console.log(`Fetching page ${pageNo}/${totalPages}...`);

        const response = await axios.get(`${urlBase}&pageNo=${pageNo}`);
        const medicines = response.data.body.items || [];

        const upsertPromises = medicines.map(async (medicine: MedicineData) => {
          if (!medicine?.ITEM_SEQ) {
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
        });

        await Promise.all(upsertPromises);
      })
    );

    console.log('All Medicine data synced successfully.');
  } catch (error) {
    console.error('Error in syncMedicines:', error.message);
    throw error;
  }
}

// 2. 의약품 공공 상세 데이터 가져오기
export async function syncApprovals(): Promise<void> {
  const urlBase = `${BASE_URL}/DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnDtlInq05?serviceKey=${API_KEY}&type=json&numOfRows=${NUM_OF_ROWS}`;

  try {
    const initialResponse = await axios.get(`${urlBase}&pageNo=1`);
    const totalCount = initialResponse.data.body?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / NUM_OF_ROWS);

    console.log(`Total count: ${totalCount}, Total pages: ${totalPages}`);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    await Promise.all(
      pageNumbers.map(async pageNo => {
        console.log(`Fetching page ${pageNo}/${totalPages}...`);

        const response = await axios.get(`${urlBase}&pageNo=${pageNo}`);
        const approvals = response.data.body?.items || [];

        const upsertPromises = approvals.map(async approval => {
          if (!approval.ITEM_SEQ) {
            return;
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
            eeDocData: approval.EE_DOC_DATA ? approval.EE_DOC_DATA : null,
            udDocData: approval.UD_DOC_DATA ? approval.UD_DOC_DATA : null,
            nbDocData: approval.NB_DOC_DATA ? approval.NB_DOC_DATA : null,
          });
        });

        await Promise.all(upsertPromises);
      })
    );

    console.log('All approval data synced successfully.');
  } catch (error) {
    console.error('Error syncing approval data:', error.message);
    throw error;
  }
}

// 3. 특정 의약품의 기본 정보와 상세 정보를 함께 조회
export async function getJoinedMedicines(itemSeq: string): Promise<JoinedMedicine | null> {
  try {
    const medicine = await Medicine.findOne({
      where: { itemSeq },
      include: [
        {
          model: MedicineDesc,
          required: false, // MedicineDesc가 없어도 데이터 반환
        },
      ],
    });

    if (!medicine) {
      return null;
    }

    // MedicineDesc가 null일 경우 안전하게 처리
    const medicineDesc = medicine.MedicineDesc || {};

    return {
      itemSeq: medicine.itemSeq,
      itemName: medicine.itemName,
      entpName: medicine.entpName,
      itemPermitDate: medicine.itemPermitDate,
      chart: medicine.chart,
      colorClass1: medicine.colorClass1,
      className: medicine.className,
      etcOtcName: medicine.etcOtcName,
      itemImage: medicine.itemImage,
      formCodeName: medicine.formCodeName,
      drugShape: medicine.drugShape,
      lengLong: medicine.lengLong,
      lengShort: medicine.lengShort,
      thick: medicine.thick,
      storageMethod: medicineDesc.storageMethod || null, // null-safe 접근
      validTerm: medicineDesc.validTerm || null, // null-safe 접근
      packUnit: medicineDesc.packUnit || null, // null-safe 접근
      eeDocData: medicineDesc.eeDocData || null, // null-safe 접근
      udDocData: medicineDesc.udDocData || null, // null-safe 접근
      nbDocData: medicineDesc.nbDocData || null, // null-safe 접근
    };
  } catch (error) {
    console.error('Error fetching joined data:', error.message);
    throw error;
  }
}


// 4. 모든 의약품 정보를 페이지네이션 방식으로 조회
export async function getAllMedicines(page: number, limit: number) {
  try {
    const offset = (page - 1) * limit;

    const results = await Medicine.findAndCountAll({
      include: [
        {
          model: MedicineDesc,
          required: false,
        },
      ],
      limit,
      offset,
    });

    return {
      data: results.rows,
      total: results.count,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(results.count / limit),
        limit,
      },
    };
  } catch (error) {
    console.error('Error fetching all medicines:', error.message);
    throw error;
  }
}
