export interface MedicineData {
  itemSeq: string;
  itemName: string;
  entpName: string;
  itemPermitDate: string | null;
  chart: string | null;
  colorClass1: string | null;
  className: string | null;
  etcOtcName: string | null;
  itemImage: string | null;
  formCodeName: string | null;
  drugShape: string | null;
  lengLong: number | null;
  lengShort: number | null;
  thick: number | null;
  storageMethod: string | null;
  validTerm: string | null;
  packUnit: string | null;
  eeDocData: string | null;
  udDocData: string | null;
  nbDocData: string | null;
}

export interface MedicineFavorite {
  medicineId: string;
  itemName: string;
  entpName: string;
  etcOtcName: string;
  className: string;
  itemImage: string;
}