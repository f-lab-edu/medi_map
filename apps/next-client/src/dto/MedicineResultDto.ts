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

export interface ApprovalInfo {
  STORAGE_METHOD?: string;  // 저장 방법
  VALID_TERM?: string;      // 유효 기간
  PACK_UNIT?: string;       // 포장 단위
  EE_DOC_DATA?: DocData;    // 효능 효과 관련 문서 데이터
  UD_DOC_DATA?: DocData;    // 사용상 주의사항 관련 문서 데이터
  NB_DOC_DATA?: DocData;    // 주의사항 관련 문서 데이터
}

export interface MedicineResultDto {
  ITEM_SEQ: number;             // 약물 고유 식별 번호
  ITEM_NAME: string;            // 약물 이름
  ITEM_IMAGE?: string;          // 약물 이미지 URL
  CLASS_NAME: string;           // 약물 분류 이름
  ENTP_NAME: string;            // 제조사 이름
  ETC_OTC_NAME?: string;        // 전문의약품/일반의약품 구분
  CHART?: string;               // 약물 외형 설명
  DRUG_SHAPE?: string;          // 약물 모양
  COLOR_CLASS1?: string;        // 약물 색상1
  COLOR_CLASS2?: string;        // 약물 색상2
  LENG_LONG?: number;           // 약물 길이
  LENG_SHORT?: number;          // 약물 폭
  THICK?: number;               // 약물 두께
  PRINT_FRONT?: string;         // 약물 앞면 인쇄 코드
  PRINT_BACK?: string;          // 약물 뒷면 인쇄 코드
  ITEM_PERMIT_DATE?: string;    // 허가 날짜
  FORM_CODE_NAME?: string;      // 제형 코드 이름
  approvalInfo?: ApprovalInfo;  // 승인 정보 (문서 데이터 포함)
}