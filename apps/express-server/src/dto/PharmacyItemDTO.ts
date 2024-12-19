import { PharmacyItem } from '@/models';
import { PharmacyAPIItem } from '@/types/pharmacy.types';

export class PharmacyItemDTO {
  static fromAPI(item: PharmacyAPIItem): PharmacyItem {
    return {
      id: 0,
      dutyName: item.dutyName,
      dutyAddr: item.dutyAddr,
      dutyTel1: item.dutyTel1 || null,
      wgs84Lat: item.wgs84Lat || null,
      wgs84Lon: item.wgs84Lon || null,
      dutyTime1s: item.dutyTime1s || null,
      dutyTime1c: item.dutyTime1c || null,
      dutyTime2s: item.dutyTime2s || null,
      dutyTime2c: item.dutyTime2c || null,
      dutyTime3s: item.dutyTime3s || null,
      dutyTime3c: item.dutyTime3c || null,
      dutyTime4s: item.dutyTime4s || null,
      dutyTime4c: item.dutyTime4c || null,
      dutyTime5s: item.dutyTime5s || null,
      dutyTime5c: item.dutyTime5c || null,
      dutyTime6s: item.dutyTime6s || null,
      dutyTime6c: item.dutyTime6c || null,
      dutyTime7s: item.dutyTime7s || null,
      dutyTime7c: item.dutyTime7c || null,
      hpid: item.hpid || null,
    };
  }
}
