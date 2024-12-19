import { Medicine } from '@/models';
import { MedicineData } from '@/types/medicine.types';
import moment from 'moment';

export class MedicineItemDTO {
  static fromAPI(item: MedicineData): Medicine {
    const itemSeq = item.ITEM_SEQ || `TEMP-${Date.now()}`;

    return {
      itemSeq,
      itemName: item.ITEM_NAME || 'Unknown',
      entpName: item.ENTP_NAME || null,
      itemPermitDate: item.ITEM_PERMIT_DATE
        ? moment(item.ITEM_PERMIT_DATE, 'YYYYMMDD').format('YYYY-MM-DD')
        : null,
      chart: item.CHART || null,
      colorClass1: item.COLOR_CLASS1 || null,
      className: item.CLASS_NAME || null,
      etcOtcName: item.ETC_OTC_NAME || null,
      itemImage: item.ITEM_IMAGE || null,
      formCodeName: item.FORM_CODE_NAME || null,
      drugShape: item.DRUG_SHAPE || null,
      lengLong: item.LENG_LONG ? parseFloat(item.LENG_LONG) : null,
      lengShort: item.LENG_SHORT ? parseFloat(item.LENG_SHORT) : null,
      thick: item.THICK ? parseFloat(item.THICK) : null,
    };
  }
}
