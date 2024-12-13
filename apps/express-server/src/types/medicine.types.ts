// eslint-disable-next-line no-inline-comments
export interface Paragraph {
  cdata?: string;
  text?: string;
  tagName?: string;
}

export interface Article {
  title?: string;
  PARAGRAPH?: Paragraph | Paragraph[];
}

export interface Section {
  ARTICLE?: Article | Article[];
}

export interface DocData {
  DOC?: {
    title?: string;
    SECTION?: Section;
  };
}

export interface ApprovalData {
  STORAGE_METHOD?: string; // 저장 방법
  VALID_TERM?: string; // 유효 기간
  PACK_UNIT?: string; // 포장 단위
  EE_DOC_DATA?: DocData; // 효능 효과 관련 문서 데이터
  UD_DOC_DATA?: DocData; // 사용상 주의사항 관련 문서 데이터
  NB_DOC_DATA?: DocData; // 주의사항 관련 문서 데이터
}

export interface MedicineData {
  ITEM_SEQ: number; // 약물 고유 식별 번호
  ITEM_NAME: string; // 약물 이름
  ENTP_NAME: string; // 제조사 이름
  ITEM_PERMIT_DATE: string; // 약물 허가 날짜
  CHART?: string; // 약물 외형 설명
  COLOR_CLASS1?: string; // 약물 색상1
  CLASS_NAME: string; // 약물 분류 이름
  ETC_OTC_NAME?: string; // 약물 구분
  ITEM_IMAGE?: string; // 약물 이미지 URL
  FORM_CODE_NAME?: string; // 약물 제형 이름
  DRUG_SHAPE?: string; // 약물 모양
  LENG_LONG?: string; // 약물 길이
  LENG_SHORT?: string; // 약물 폭
  THICK?: string; // 약물 두께
}

export interface MedicineQuery {
  medicineName?: string;
  companyName?: string;
  color?: string;
  shape?: string;
  formCodeName?: string;
  page?: string;
  limit?: string;
}

export interface JoinedMedicine {
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

export interface QueryParams {
  medicineName?: string;
  companyName?: string;
  color?: string;
  shape?: string;
  formCodeName?: string;
}
