import { Medicine } from '@/models';
import axios from 'axios';
import moment from 'moment';
import { MedicineData, ApprovalData } from '@/types/medicineTypes';

const MEDI_DATA_API_KEY = process.env.DATA_API_KEY;

// 기본 약물 데이터 저장
async function saveMedicineData(medicineData: MedicineData): Promise<void> {
  try {
    const formattedPermitDate = medicineData.ITEM_PERMIT_DATE
      ? moment(medicineData.ITEM_PERMIT_DATE, 'YYYYMMDD').format('YYYY-MM-DD')
      : null;

    // 데이터 저장 또는 업데이트
    await Medicine.upsert({
      itemSeq: medicineData.ITEM_SEQ,
      itemName: medicineData.ITEM_NAME,
      entpName: medicineData.ENTP_NAME,
      itemPermitDate: formattedPermitDate,
      chart: medicineData.CHART,
      colorClass1: medicineData.COLOR_CLASS1,
      className: medicineData.CLASS_NAME,
      etcOtcName: medicineData.ETC_OTC_NAME,
      itemImage: medicineData.ITEM_IMAGE,
      formCodeName: medicineData.FORM_CODE_NAME,
      drugShape: medicineData.DRUG_SHAPE,
      lengLong: medicineData.LENG_LONG ?? null,
      lengShort: medicineData.LENG_SHORT ?? null,
      thick: medicineData.THICK ?? null,
    });

    console.log(`Successfully saved data for ITEM_SEQ: ${medicineData.ITEM_SEQ}`);
  } catch (error) {
    console.error('Error saving Medicine Data:', error.message, medicineData);
  }
}

// 세부 추가 정보 업데이트
async function updateApprovalInfo(itemSeq: number, approvalData: ApprovalData): Promise<void> {
  console.log(`Updating approval info for ITEM_SEQ: ${itemSeq} with data:`, approvalData);

  try {
    // 추가 정보 관련 데이터 업데이트
    await Medicine.update(
      {
        storageMethod: approvalData.STORAGE_METHOD,
        validTerm: approvalData.VALID_TERM,
        packUnit: approvalData.PACK_UNIT,
        eeDocData: approvalData.EE_DOC_DATA,
        udDocData: approvalData.UD_DOC_DATA,
        nbDocData: approvalData.NB_DOC_DATA,
      },
      { where: { itemSeq } } // itemSeq 기준으로 업데이트
    );
    console.log(`Approval info updated for ITEM_SEQ: ${itemSeq}`);
  } catch (error) {
    console.error(`Error updating approval info for ITEM_SEQ: ${itemSeq}:`, error.message);
  }
}

// 의약품 데이터 저장
async function fetchAllMedicines(): Promise<void> {
  const numOfRows = 100; // 한 번에 가져올 데이터 수
  const urlBase = `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?ServiceKey=${MEDI_DATA_API_KEY}&type=json&numOfRows=${numOfRows}`;
  let totalCount = 0;

  try {
    // 첫 번째 요청으로 전체 데이터 수 확인
    const initialResponse = await axios.get(`${urlBase}&pageNo=1`);
    totalCount = initialResponse.data.body?.totalCount || 0;

    if (totalCount === 0) {
      console.warn('No medicines found in the API.');
      return;
    }

    console.log(`Total medicines to fetch: ${totalCount}`);
    const totalPages = Math.ceil(totalCount / numOfRows); // 전체 페이지 수 계산

    // 각 페이지 순회하며 데이터 저장
    for (let pageNo = 1; pageNo <= totalPages; pageNo++) {
      console.log(`Fetching page ${pageNo}/${totalPages}...`);
      const response = await axios.get(`${urlBase}&pageNo=${pageNo}`);
      const { items } = response.data.body || {};

      // 데이터를 배열로 변환
      const medicines = Array.isArray(items) ? items : items.item ? [items.item] : [];

      // 각 약물 데이터를 저장
      for (const medicine of medicines) {
        if (!medicine || !medicine.ITEM_SEQ) {
          console.error('Invalid medicine data:', JSON.stringify(medicine, null, 2));
          continue;
        }

        console.log('Saving medicine data:', JSON.stringify(medicine, null, 2));
        await saveMedicineData(medicine);
      }
    }

    console.log('All medicines have been saved successfully.');
  } catch (error) {
    console.error('Error in fetchAllMedicines:', error.message);
    if (error.response) {
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

// 승인 정보 업데이트
async function fetchApprovalInfo(): Promise<void> {
  console.log('Fetching medicines from database for approval info update');

  const medicines = await Medicine.findAll();
  const totalMedicines = medicines.length;
  const pageSize = 100; // 한 페이지에 처리할 데이터 수
  const totalPages = Math.ceil(totalMedicines / pageSize); // 전체 페이지 수 계산
  let processedMedicines = 0; // 처리 완료된 데이터 수

  console.log(`Fetched ${totalMedicines} medicines from database.`);
  console.log(`Total pages to process: ${totalPages}`);

  // 각 페이지 순회하며 승인 정보 업데이트
  for (let pageNo = 1; pageNo <= totalPages; pageNo++) {
    console.log(`Processing page ${pageNo}/${totalPages}`);

    // 현재 페이지 데이터 추출
    const pageData = medicines.slice((pageNo - 1) * pageSize, pageNo * pageSize);

    for (const medicine of pageData) {
      const approvalUrl = `https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnDtlInq05?serviceKey=${MEDI_DATA_API_KEY}&type=json&item_seq=${medicine.itemSeq}`;

      try {
        const response = await axios.get(approvalUrl);
        const items = response.data.body.items;
        let approvalData: ApprovalData | null = null;

        // 응답 데이터 확인
        if (Array.isArray(items)) {
          approvalData = items[0] as ApprovalData;
        } else if (items?.item) {
          approvalData = items.item as ApprovalData;
        }

        // 승인 데이터가 유효하다면 업데이트
        if (approvalData) {
          await updateApprovalInfo(medicine.itemSeq, approvalData);
        } else {
          console.warn(`No valid approval data found for ITEM_SEQ: ${medicine.itemSeq}`);
        }
      } catch (error) {
        console.error(`Error fetching approval info for ITEM_SEQ: ${medicine.itemSeq}:`, error.message);
      }

      processedMedicines++; // 처리된 데이터 수 증가
      console.log(`Processed ${processedMedicines}/${totalMedicines} medicines.`);
    }

    console.log(`Completed page ${pageNo}. Waiting before next page...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 요청 제한 방지를 위해 대기
  }

  console.log('All pages have been processed.');
}

export {
  fetchAllMedicines,
  fetchApprovalInfo,
};
