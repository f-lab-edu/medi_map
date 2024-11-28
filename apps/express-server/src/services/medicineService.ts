import { Medicine } from '@/models';
import axios from 'axios';
import moment from 'moment';

const MEDI_DATA_API_KEY = process.env.DATA_API_KEY;

// Medicine 타입 정의
interface MedicineData {
  ITEM_SEQ: string;
  ITEM_NAME: string;
  ENTP_NAME: string;
  ITEM_PERMIT_DATE: string;
  CHART?: string;
  COLOR_CLASS1?: string;
  CLASS_NAME?: string;
  ETC_OTC_NAME?: string;
  ITEM_IMAGE?: string;
  FORM_CODE_NAME?: string;
  DRUG_SHAPE?: string;
  LENG_LONG?: string;
  LENG_SHORT?: string;
  THICK?: string;
}

// Approval Data 타입 정의
interface ApprovalData {
  STORAGE_METHOD?: string;
  VALID_TERM?: string;
  PACK_UNIT?: string;
  EE_DOC_DATA?: string;
  UD_DOC_DATA?: string;
  NB_DOC_DATA?: string;
}

// 기본 데이터 저장
async function saveMedicineData(medicineData: MedicineData): Promise<void> {
  try {
    console.log('Saving medicine data:', medicineData);

    // 날짜 변환
    const formattedPermitDate = medicineData.ITEM_PERMIT_DATE
      ? moment(medicineData.ITEM_PERMIT_DATE, 'YYYYMMDD').format('YYYY-MM-DD')
      : null;

    await Medicine.upsert({
      itemSeq: medicineData.ITEM_SEQ,
      itemName: medicineData.ITEM_NAME,
      entpName: medicineData.ENTP_NAME,
      itemPermitDate: formattedPermitDate, // 변환된 날짜 사용
      chart: medicineData.CHART,
      colorClass1: medicineData.COLOR_CLASS1,
      className: medicineData.CLASS_NAME,
      etcOtcName: medicineData.ETC_OTC_NAME,
      itemImage: medicineData.ITEM_IMAGE,
      formCodeName: medicineData.FORM_CODE_NAME,
      drugShape: medicineData.DRUG_SHAPE,
      lengLong: medicineData.LENG_LONG ? parseFloat(medicineData.LENG_LONG) : null,
      lengShort: medicineData.LENG_SHORT ? parseFloat(medicineData.LENG_SHORT) : null,
      thick: medicineData.THICK ? parseFloat(medicineData.THICK) : null,
    });

    console.log(`Successfully saved data for ITEM_SEQ: ${medicineData.ITEM_SEQ}`);
  } catch (error) {
    console.error('Error saving Medicine Data:', error.message, medicineData);
  }
}

// 세부 정보 업데이트
async function updateApprovalInfo(itemSeq: string, approvalData: ApprovalData): Promise<void> {
  console.log(`Updating approval info for ITEM_SEQ: ${itemSeq} with data:`, approvalData);

  try {
    await Medicine.update(
      {
        storageMethod: approvalData.STORAGE_METHOD,
        validTerm: approvalData.VALID_TERM,
        packUnit: approvalData.PACK_UNIT,
        eeDocData: approvalData.EE_DOC_DATA,
        udDocData: approvalData.UD_DOC_DATA,
        nbDocData: approvalData.NB_DOC_DATA,
      },
      { where: { itemSeq } }
    );
    console.log(`Approval info updated for ITEM_SEQ: ${itemSeq}`);
  } catch (error) {
    console.error(`Error updating approval info for ITEM_SEQ: ${itemSeq}:`, error.message);
  }
}


// 모든 데이터 저장
async function fetchAndSaveAllMedicines(): Promise<void> {
  const numOfRows = 100; // 한 페이지에 가져올 데이터 수
  const urlBase = `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?ServiceKey=${MEDI_DATA_API_KEY}&type=json&numOfRows=${numOfRows}`;
  let totalCount = 0;

  try {
    // 첫 번째 요청: totalCount 가져오기
    const initialResponse = await axios.get(`${urlBase}&pageNo=1`);

    totalCount = initialResponse.data.body?.totalCount || 0;
    if (totalCount === 0) {
      console.warn('No medicines found in the API.');
      return;
    }

    console.log(`Total medicines to fetch: ${totalCount}`);
    const totalPages = Math.ceil(totalCount / numOfRows);
    console.log(`Total pages to fetch: ${totalPages}`);

    // 페이지 순회
    for (let pageNo = 1; pageNo <= totalPages; pageNo++) {
      console.log(`Fetching page ${pageNo}/${totalPages}...`);
      const response = await axios.get(`${urlBase}&pageNo=${pageNo}`);
      const { items } = response.data.body || {};

      // 데이터가 배열인지 확인하고 처리
      const medicines = Array.isArray(items) ? items : items.item ? [items.item] : [];

      // `saveMedicineData` 호출
      for (const medicine of medicines) {
        if (!medicine || !medicine.ITEM_SEQ) {
          console.error('Invalid medicine data:', JSON.stringify(medicine, null, 2));
          continue; // 유효하지 않은 데이터는 무시
        }

        console.log('Saving medicine data:', JSON.stringify(medicine, null, 2));
        await saveMedicineData(medicine);
      }
    }

    console.log('All medicines have been saved successfully.');
  } catch (error) {
    console.error('Error in fetchAndSaveAllMedicines:', error.message);
    if (error.response) {
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}


// 세부 정보 업데이트
async function fetchAndUpdateApprovalInfo(): Promise<void> {
  console.log('Fetching medicines from database for approval info update');

  const medicines = await Medicine.findAll();

  console.log(`Fetched ${medicines.length} medicines from database.`);

  for (const medicine of medicines) {
    console.log(`Fetching approval info for ITEM_SEQ: ${medicine.itemSeq}`);

    const approvalUrl = `https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnDtlInq05?serviceKey=${MEDI_DATA_API_KEY}&type=json&item_seq=${medicine.itemSeq}`;

    try {
      const response = await axios.get(approvalUrl);
      console.log(`Approval info received for ITEM_SEQ: ${medicine.itemSeq}`, response.data);

      const items = response.data.body.items;
      let approvalData: ApprovalData | null = null;

      if (Array.isArray(items)) {
        // items가 배열일 경우 첫 번째 요소를 가져옵니다.
        approvalData = items[0] as ApprovalData;
      } else if (items?.item) {
        // items.item이 객체일 경우 처리
        approvalData = items.item as ApprovalData;
      }

      if (approvalData) {
        console.log(`Updating database for ITEM_SEQ: ${medicine.itemSeq} with data:`, approvalData);
        await updateApprovalInfo(medicine.itemSeq, approvalData);
      } else {
        console.warn(`No valid approval data found for ITEM_SEQ: ${medicine.itemSeq}`);
      }
    } catch (error) {
      console.error(`Error fetching approval info for ITEM_SEQ: ${medicine.itemSeq}:`, error.message);
    }
  }

  console.log('Approval info update completed.');
}


export {
  fetchAndSaveAllMedicines,
  fetchAndUpdateApprovalInfo,
};
